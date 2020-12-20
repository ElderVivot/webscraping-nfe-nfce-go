import { Page } from 'puppeteer'

import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

async function getQtdNotes (page: Page): Promise<number> {
    try {
        const qtdNotesText: string = await page.$eval('#dnwld-all-num-elemnts', element => element.textContent)
        const qtdNotes: number = Number(qtdNotesText.split(':')[1])
        return qtdNotes
    } catch (error) {
        return 0
    }
}

export async function ClickDownloadModal (page: Page, settings: ISettingsNFeGoias): Promise<number> {
    try {
        await page.waitForTimeout(4000)
        // await page.waitFor(2000)
        await page.waitForSelector('#dnwld-all-btn-ok')
        await page.click('#cmpPagTds')
        const qtdNotes = await getQtdNotes(page)
        if (!qtdNotes) {
            throw 'NOT_EXIST_NOTES_TO_DOWN'
        }
        await page.click('#dnwld-all-btn-ok')
        return qtdNotes
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'ClickDownloadModal'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao clicar pra baixar as notas na tela suspensa'
        if (error === 'NOT_EXIST_NOTES_TO_DOWN') {
            settings.typeLog = 'warning'
            settings.messageLogToShowUser = 'Não encontrou notas na tela suspensa'
        }
        console.log(`\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings, null, true)
        await treatsMessageLog.saveLog()
        return 0
    }
}