import path from 'path'
import { Page } from 'puppeteer'

import { createFolderToSaveData } from './CreateFolderToSaveData'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

export async function CreateFolderToSaveXmls (page: Page, settings: ISettingsNFeGoias): Promise<void> {
    try {
        const pathNote = await createFolderToSaveData(settings)
        const client = await page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: path.resolve(pathNote)
        })
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'UpdateFolderToSaveXmls'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao criar pasta pra salvar os xmls.'
        console.log(`\t\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings)
        await treatsMessageLog.saveLog()
    }
}