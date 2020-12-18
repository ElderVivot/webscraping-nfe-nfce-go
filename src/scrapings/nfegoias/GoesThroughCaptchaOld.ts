import { Page } from 'puppeteer'

import { promiseTimeOut } from '../../utils/promise-time-out'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

export async function GoesThroughCaptcha (page: Page, settings: ISettingsNFeGoias): Promise<void> {
    try {
        // time out 1.5 minutes if captcha not return results
        await Promise.race([page.solveRecaptchas(), promiseTimeOut(90000)])
        await Promise.all([
            page.waitForNavigation(),
            page.click("button[form='filtro']")
        ])
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'GoesThroughCaptcha'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao passar pelo captcha.'
        console.log(`\t\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings)
        await treatsMessageLog.saveLog()
    }
}