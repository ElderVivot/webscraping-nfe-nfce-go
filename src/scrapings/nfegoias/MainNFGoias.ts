import { zonedTimeToUtc } from 'date-fns-tz'
import path from 'path'
// import puppeteer from 'puppeteer-core'
import puppeteer from 'puppeteer'
// import puppeteer from 'puppeteer-extra'
// import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import 'dotenv/config'

import { cleanDataObject } from '../../utils/clean-data-object'
import * as functions from '../../utils/functions'
import { ChangeCnpj } from './ChangeCnpj'
import { CheckIfCompanieIsValid } from './CheckIfCompanieIsValid'
import { CheckIfDownloadInProgress } from './CheckIfDownloadInProgress'
import { CheckIfSemResultados } from './CheckIfSemResultados'
import { ClickDownloadAll } from './ClickDownloadAll'
import { ClickDownloadModal } from './ClickDownloadModal'
import { ClickOkDownloadFinish } from './ClickOkDownloadFinish'
// import { CloseOnePage } from './CloseOnePage'
import { CreateFolderToSaveXmls } from './CreateFolderToSaveXmls'
import { GetCnpjs } from './GetCnpjs'
import { GoesThroughCaptcha } from './GoesThroughCaptcha'
import { InputModeloToDownload } from './InputModeloToDownload'
import { InputPeriodToDownload } from './InputPeriodToDownload'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { LoguinCertificado } from './LoguinCertificado'
import { PeriodToDownNFeGoias } from './PeriodToDownNFeGoias'
import { SendLastDownloadToQueue } from './SendLastDownloadToQueue'
import { SetDateInicialAndFinalOfMonth } from './SetDateInicialAndFinalOfMonth'

const modelosNFe = ['55', '65']

export async function MainNFGoias (settings: ISettingsNFeGoias = {}): Promise<void> {
    // puppeteer.use(
    //     RecaptchaPlugin({
    //         provider: {
    //             id: '2captcha',
    //             token: process.env.API_2CAPTCHA
    //         },
    //         visualFeedback: true
    //     })
    // )

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
    // const qtdEmpresas = 0

    // Percorre o array de empresas
    for (const option of optionsCnpjs) {
        settings.cgceCompanie = option.value
        console.log(`4- Abrindo CNPJ ${option.label}`)

        for (const modelo of modelosNFe) {
            settings.typeNF = modelo === '55' ? 'NF-e' : 'NFC-e'
            settings.modelNF = modelo
            console.log(`\t5- Buscando ${settings.typeNF}`)

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
                        // if (month === 12) continue // por enquanto ignora mes 12
                        //  clean settings to old don't affect new process
                        settings = cleanDataObject(settings, [], ['wayCertificate', 'hourLog', 'dateHourProcessing', 'nameCompanie', 'cgceCompanie', 'modelNF', 'typeNF'])
                        const dateInicialAndFinalOfMonth = SetDateInicialAndFinalOfMonth(periodToDown, month, year)
                        const monthSring = functions.zeroLeft(month.toString(), 2)
                        console.log(`\t6- Iniciando processamento do mês ${monthSring}/${year}`)

                        settings.dateStartDown = `${functions.convertDateToString(new Date(zonedTimeToUtc(dateInicialAndFinalOfMonth.inicialDate, 'America/Sao_Paulo')))} 03:00:00 AM`
                        settings.dateEndDown = `${functions.convertDateToString(new Date(zonedTimeToUtc(dateInicialAndFinalOfMonth.finalDate, 'America/Sao_Paulo')))} 03:00:00 AM`
                        settings.year = year
                        settings.month = monthSring
                        settings.entradasOrSaidas = 'Saidas'

                        console.log('\t7- Checando se é uma empresa válida pra este período.')
                        settings = await CheckIfCompanieIsValid(page, settings)

                        try {
                            // const pageMonth = await browser.newPage()
                            // await pageMonth.setViewport({ width: 0, height: 0 })
                            await page.goto(urlActual)

                            console.log('\t8- Informando o CNPJ e período pra download.')
                            await InputPeriodToDownload(page, settings)
                            await ChangeCnpj(page, settings)

                            console.log('\t9- Informando o modelo')
                            await InputModeloToDownload(page, settings)

                            console.log('\t10- Passando pelo Captcha')
                            await GoesThroughCaptcha(page, settings)

                            console.log('\t11- Verificando se há notas no filtro passado')
                            await CheckIfSemResultados(page, settings)

                            console.log('\t12- Clicando pra baixar todos os arquivos')
                            await ClickDownloadAll(page, settings)

                            console.log('\t13- Clicando pra baixar dentro do modal')
                            const qtdNotes = await ClickDownloadModal(page, settings)
                            settings.qtdNotes = qtdNotes

                            console.log(`\t14- Criando pasta pra salvar ${settings.qtdNotes} notas`)
                            settings.typeLog = 'success' // update to sucess to create folder
                            await CreateFolderToSaveXmls(page, settings)

                            console.log('\t15- Checando se o download ainda está em progresso')
                            await CheckIfDownloadInProgress(page, settings)

                            console.log('\t16- Após processamento concluído, clicando em OK pra finalizar')
                            await ClickOkDownloadFinish(page, settings)

                            console.log('\t17- Enviando informação que o arquivo foi baixado pra fila de salvar o processamento.')
                            await SendLastDownloadToQueue(page, settings)

                            console.log('\t[Final-Empresa-Mes]')
                            console.log('\t-------------------------------------------------')
                            // await CloseOnePage(page, 'Empresa')
                        } catch (error) { console.log(error) }
                    }
                    year++
                }
                // qtdEmpresas++
                // if (qtdEmpresas === optionsCnpjs.length) {
                //     if (browser.isConnected()) await browser.close()
                // }
            } catch (error) { console.log(error) }
        }
    }
    console.log('[Final] - Todos os dados deste navegador foram processados, fechando navegador.')
    if (browser.isConnected()) await browser.close()
}

// const hourLog = format(new Date(), 'yyyy-MM-dd hh:mm:ss a', { timeZone: 'America/Sao_Paulo' })
// MainNFGoias({ hourLog }).then(_ => console.log(_))