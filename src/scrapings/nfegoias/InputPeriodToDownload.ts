import { Page } from 'puppeteer'

import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

export async function InputPeriodToDownload (page: Page, settings: ISettingsNFeGoias): Promise<void> {
    try {
        await page.waitForSelector('#cmpDataInicial')
        await page.evaluate(`document.getElementById("cmpDataInicial").value="${settings.dateStartDown}";`)
        await page.evaluate(`document.getElementById("cmpDataFinal").value="${settings.dateEndDown}";`)
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'InputPeriodToDownload'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao informar o período pra download das notas.'
        console.log(`\t\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings)
        await treatsMessageLog.saveLog()
    }
}