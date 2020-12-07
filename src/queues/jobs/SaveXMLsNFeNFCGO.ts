import fsExtra from 'fs-extra'
import path from 'path'

import { createFolderToSaveData } from '../../scrapings/nfegoias/CreateFolderToSaveData'
import { ISettingsNFeGoias } from '../../scrapings/nfegoias/ISettingsNFeGoias'

const SaveXMLsNFeNFCGO = {
    key: 'SaveXMLsNFeNFCGO',
    async handle ({ data }): Promise<void> {
        const settings: ISettingsNFeGoias = data.settings
        const pathThatTheFileIsDownloaded = data.pathThatTheFileIsDownloaded
        const nameFile = path.basename(pathThatTheFileIsDownloaded)

        console.log('---------------------------------------------------')
        console.log(`- [XMLsNFeNFCeGO] - Iniciando processamento ${settings.nameCompanie} comp. ${settings.month}-${settings.year}`)

        const pathRoutineAutomactic = await createFolderToSaveData(settings, true)

        if (settings.codeCompanie && pathRoutineAutomactic) {
            await fsExtra.copy(pathThatTheFileIsDownloaded, path.resolve(pathRoutineAutomactic, nameFile))
        }
    }
}

export default SaveXMLsNFeNFCGO