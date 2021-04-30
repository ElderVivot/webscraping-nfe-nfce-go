import 'dotenv/config'
import { Page } from 'puppeteer'

import GetLogFetchCompetence from '../../controllers/GetLogFetchCompetence'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

export async function ChecksIfFetchInCompetence (page: Page, settings: ISettingsNFeGoias): Promise<void> {
    try {
        const getLogFetchCompetence = new GetLogFetchCompetence()
        const dataLog = await getLogFetchCompetence.show(`?cgceCompanie=${settings.cgceCompanie}&modelNF=${settings.modelNF}&month=${settings.month}&year=${settings.year}`)
        const dayEnd = new Date(settings.dateEndDown).getDate()
        const { daymaxdown } = dataLog

        if (daymaxdown && daymaxdown >= dayEnd) {
            throw 'PERIOD_ALREADY_PROCESSED'
        }
    } catch (error) {
        let saveInDB = true
        settings.typeLog = 'error'
        settings.messageLog = 'ChecksIfFetchInCompetence'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao verificar se o período já foi procesado antes.'
        if (error === 'PERIOD_ALREADY_PROCESSED') {
            settings.typeLog = 'warning'
            settings.messageLogToShowUser = 'Período já processado anteriormente.'
            saveInDB = false
        }
        console.log(`\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings, null, true)
        await treatsMessageLog.saveLog(saveInDB)
    }
}

// const periodToDownNotesGoiania = new PeriodToDownNotesGoiania({
//     dateHourProcessing: '',
//     hourLog: '',
//     idUser: 0,
//     loguin: '',
//     password: '',
//     inscricaoMunicipal: '4273222'
// })
// periodToDownNotesGoiania.process().then(result => console.log(result))