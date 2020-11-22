import { format, zonedTimeToUtc } from 'date-fns-tz'
import path from 'path'
import puppeteer from 'puppeteer-core'
// import puppeteerOriginal from 'puppeteer'
// import puppeteerExtra from 'puppeteer-extra'

import * as functions from '../../utils/functions'
import { ChangeCnpj } from './ChangeCnpj'
import { CheckIfCompanieIsActive } from './CheckIfCompanieIsActive'
import { CheckIfDownloadInProgress } from './CheckIfDownloadInProgress'
import { CheckIfSemResultados } from './CheckIfSemResultados'
import { ClickDownloadAll } from './ClickDownloadAll'
import { ClickDownloadModal } from './ClickDownloadModal'
import { ClickOkDownloadFinish } from './ClickOkDownloadFinish'
import { CloseOnePage } from './CloseOnePage'
import { CreateFolderToSaveXmls } from './CreateFolderToSaveXmls'
import { GetCnpjs } from './GetCnpjs'
import { GoesThroughCaptcha } from './GoesThroughCaptcha'
import { InputModeloToDownload } from './InputModeloToDownload'
import { InputPeriodToDownload } from './InputPeriodToDownload'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { LoguinCertificado } from './LoguinCertificado'
import { PeriodToDownNFeGoias } from './PeriodToDownNFeGoias'
import { SetDateInicialAndFinalOfMonth } from './SetDateInicialAndFinalOfMonth'

const modelosNFe = ['55', '65']

export async function MainNFGoias (settings: ISettingsNFeGoias = {}): Promise<void> {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: false,
        args: ['--start-maximized'],
        // devtools: true,
        executablePath: path.join('C:', 'Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe')
    })

    const { dateStartDown, dateEndDown } = settings

    console.log('1- Abrindo nova página')
    const page = await browser.newPage()
    await page.setViewport({ width: 0, height: 0 })

    console.log('2- Fazendo loguin com certificado')
    await LoguinCertificado(page, browser, settings)

    console.log('3- Pegando relação de CNPS que este certificado tem acesso')
    const optionsCnpjs = await GetCnpjs(page, browser, settings)

    // Pega a URL atual pra não ter que abrir do zero o processo
    const urlActual = page.url()
    let qtdEmpresas = 0

    // Percorre o array de empresas
    for (const option of optionsCnpjs) {
        // Pega o período necessário pra processamento
        let periodToDown = null
        if (!dateStartDown && !dateEndDown) {
            periodToDown = await PeriodToDownNFeGoias(settings)
        } else {
            periodToDown = {
                dateStart: new Date(zonedTimeToUtc(dateStartDown, 'America/Sao_Paulo')),
                dateEnd: new Date(zonedTimeToUtc(dateEndDown, 'America/Sao_Paulo'))
            }
        }
        let year = periodToDown.dateStart.getFullYear()
        const yearInicial = year
        const yearFinal = periodToDown.dateEnd.getFullYear()
        const monthInicial = periodToDown.dateStart.getMonth() + 1
        const monthFinal = periodToDown.dateEnd.getMonth() + 1

        try {
            while (year <= yearFinal) {
                const months = functions.returnMonthsOfYear(year, monthInicial, yearInicial, monthFinal, yearFinal)

                for (const month of months) {
                    //  clean settings to old don't affect new process
                    settings = {}
                    const dateInicialAndFinalOfMonth = SetDateInicialAndFinalOfMonth(periodToDown, month, year)
                    const monthSring = functions.zeroLeft(month.toString(), 2)

                    settings.cgceCompanie = option.value
                    settings.dateStartDown = format(new Date(zonedTimeToUtc(dateInicialAndFinalOfMonth.inicialDate, 'America/Sao_Paulo')), 'dd/MM/yyyy', { timeZone: 'America/Sao_Paulo' })
                    settings.dateEndDown = format(new Date(zonedTimeToUtc(dateInicialAndFinalOfMonth.finalDate, 'America/Sao_Paulo')), 'dd/MM/yyyy', { timeZone: 'America/Sao_Paulo' })
                    settings.year = year
                    settings.month = monthSring

                    console.log('\t4- Checando se a empresa é cliente neste período.')
                    settings = await CheckIfCompanieIsActive(page, settings)

                    for (const modelo of modelosNFe) {
                        settings.typeNF = modelo === '55' ? 'NF-e' : 'NFC-e'

                        try {
                            const pageMonth = await browser.newPage()
                            await pageMonth.setViewport({ width: 0, height: 0 })
                            await pageMonth.goto(urlActual)

                            console.log(`\t5- Abrindo CNPJ ${option.label}`)
                            await ChangeCnpj(pageMonth, settings)

                            console.log(`\t6- Iniciando processamento do mês ${monthSring}/${year}`)

                            console.log(`\t7- Buscando ${settings.typeNF}`)

                            console.log('\t8- Informando período e modelo')
                            await InputPeriodToDownload(pageMonth, settings)
                            await InputModeloToDownload(pageMonth, settings)

                            console.log('\t9- Passando pelo Captcha')
                            await GoesThroughCaptcha(pageMonth, settings)

                            console.log('\t10- Verificando se há notas no filtro passado')
                            await CheckIfSemResultados(pageMonth, settings)

                            console.log('\t11- Clicando pra baixar todos os arquivos')
                            await ClickDownloadAll(pageMonth, settings)

                            console.log('\t12- Clicando pra baixar dentro do modal')
                            const qtdNotes = await ClickDownloadModal(pageMonth, settings)
                            settings.qtdNotes = qtdNotes

                            console.log(`\t13- Criando pasta pra salvar ${settings.qtdNotes} notas`)
                            settings.typeLog = 'success' // update to sucess to create folder
                            await CreateFolderToSaveXmls(pageMonth, settings)

                            console.log('\t14- Checando se o download ainda está em progresso')
                            await CheckIfDownloadInProgress(pageMonth, settings)

                            console.log('\t15- Após processamento concluído, clicando em OK pra finalizar')
                            await ClickOkDownloadFinish(pageMonth, settings)

                            await CloseOnePage(pageMonth, 'Empresa')
                        } catch (error) { console.log(error) }
                    }
                }
                year++
            }
            qtdEmpresas++
            if (qtdEmpresas === optionsCnpjs.length) {
                if (browser.isConnected()) await browser.close()
            }
        } catch (error) { console.log(error) }
    }
    console.log('[Final] - Todos os dados deste navegador foram processados, fechando navegador.')
    if (browser.isConnected()) await browser.close()
}

MainNFGoias().then(_ => console.log(_))