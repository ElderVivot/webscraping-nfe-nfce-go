import { Page } from 'puppeteer'

import GetCompanie from '../../services/GetCompanie'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'
import 'dotenv/config'

const isOnlyCompanieActive = (): boolean => {
    let companiesOnlyActive = false
    if (process.env.COMPANIES_ONLY_ACTIVE === 'true') {
        companiesOnlyActive = true
    }
    return companiesOnlyActive
}

export async function CheckIfCompanieIsActive (page: Page, settings: ISettingsNFeGoias): Promise<ISettingsNFeGoias> {
    try {
        const companiesOnlyActive = isOnlyCompanieActive()
        const { cgceCompanie, month, year } = settings
        const getCompanie = new GetCompanie(`?cgce=${cgceCompanie}`, companiesOnlyActive, Number(month), year)
        const companie = await getCompanie.getCompanie()

        settings.codeCompanie = companie ? companie.code : ''
        settings.nameCompanie = companie ? companie.name : settings.nameCompanie

        if (companiesOnlyActive && !settings.codeCompanie) {
            throw 'COMPANIE_NOT_CLIENT_THIS_ACCOUNTING_OFFICE'
        }
        return settings
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'LoguinCertificado'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao fazer loguin com o certificado.'
        console.log(`[Final] - ${settings.messageLogToShowUser}`)
        console.log('-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings)
        await treatsMessageLog.saveLog()
    }
}