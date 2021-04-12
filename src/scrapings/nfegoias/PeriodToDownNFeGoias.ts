import 'dotenv/config'
import { subMonths, subDays, addDays } from 'date-fns'
import { Page } from 'puppeteer'

import GetMaxDateDownNfeNfce from '../../controllers/GetMaxDateDownNfeNfce'
import IPeriodToDownNotes from '../../models/IPeriodToDownNotes'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

const getDateStart = (datedownmax: any): Date => {
    let dateStart: Date
    if (!datedownmax) {
        dateStart = subMonths(new Date(), Number(process.env.RETROACTIVE_MONTHS_TO_DOWNLOAD) || 0)
        dateStart.setDate(1)
    } else {
        dateStart = addDays(new Date(datedownmax), 1)
    }
    return dateStart
}

const getDateEnd = (): Date => {
    const today = new Date()
    let dateEnd = subDays(today, 1)
    if (today.getDate() > 15) {
        dateEnd = new Date(today.getFullYear(), today.getMonth(), 0)
    } else {
        dateEnd = today
        dateEnd.setDate(15)
    }
    return dateEnd
}

export async function PeriodToDownNFeGoias (page: Page, settings: ISettingsNFeGoias): Promise<IPeriodToDownNotes> {
    try {
        const getMaxDateDownNfeNfce = new GetMaxDateDownNfeNfce()
        const maxDate = await getMaxDateDownNfeNfce.getMaxDateDown(`?cgceCompanie=${settings.cgceCompanie}&modelNF=${settings.modelNF}`)
        const datedownmax = maxDate?.datedownmax

        const dateStart = getDateStart(datedownmax)
        const dateEnd = getDateEnd()

        if (dateStart >= dateEnd) {
            throw 'DONT_HAVE_NEW_PERIOD_TO_PROCESS'
        }

        return {
            dateStart, dateEnd
        }
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'PeriodToDownNFeGoias'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao verificar o período pra baixar.'
        if (error === 'DONT_HAVE_NEW_PERIOD_TO_PROCESS') {
            settings.typeLog = 'warning'
            settings.messageLogToShowUser = 'Não há um novo período pra processar, ou seja, o último processamento já buscou o período máximo.'
        }
        console.log(`\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings, null, true)
        await treatsMessageLog.saveLog()
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