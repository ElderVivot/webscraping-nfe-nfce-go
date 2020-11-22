import { Page } from 'puppeteer'

import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

export async function CheckIfSemResultados (page: Page, settings: ISettingsNFeGoias): Promise<void> {
    try {
        const semResultadoOriginal: string = await page.$eval('#message-containter > div:nth-child(1)', element => element.textContent)
        const semResultado = semResultadoOriginal ? semResultadoOriginal.toUpperCase() : ''
        if (semResultado.indexOf('SEM RESULTADO') >= 0) {
            throw 'NOT_EXIST_NOTES'
        }
    } catch (error) {
        if (error === 'NOT_EXIST_NOTES') {
            settings.typeLog = 'warning'
            settings.messageLogToShowUser = 'Não há notas no período informado'

            settings.messageLog = 'CheckIfSemResultados'
            settings.messageError = error

            console.log(`\t\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
            console.log('\t\t-------------------------------------------------')

            const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings)
            await treatsMessageLog.saveLog()
        }
    }
}