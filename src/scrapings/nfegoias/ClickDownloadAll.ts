import { Page } from 'puppeteer'

import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

export async function ClickDownloadAll (page: Page, settings: ISettingsNFeGoias): Promise<void> {
    try {
        await page.waitForTimeout(2000)
        await page.waitForSelector('.btn-download-all')
        await page.click('.btn-download-all')
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'ClickDownloadAll'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao clicar pra baixar todas as notas.'
        console.log(`\t\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings)
        await treatsMessageLog.saveLog()
    }
}