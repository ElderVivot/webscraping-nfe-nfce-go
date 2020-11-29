import 'dotenv/config'
import { subMonths, subDays } from 'date-fns'

// import GetMaxDateDownGoiania from '../controllers/GetMaxDateDownGoiania'
import IPeriodToDownNotes from '../../models/IPeriodToDownNotes'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function PeriodToDownNFeGoias (settings: ISettingsNFeGoias): Promise<IPeriodToDownNotes> {
    // const getMaxDateDownGoiania = new GetMaxDateDownGoiania()
    // const maxDate = await getMaxDateDownGoiania.getMaxDateDown(`?inscricaoMunicipal=${settings.inscricaoMunicipal}`)
    const maxDate = null
    const datedownmax = maxDate?.datedownmax
    let dateStart: Date
    if (!datedownmax) {
        dateStart = subMonths(new Date(), Number(process.env.RETROACTIVE_MONTHS_TO_DOWNLOAD) || 1)
        dateStart.setDate(1)
    } else {
        dateStart = new Date(datedownmax)
    }

    const dateEnd = subDays(new Date(), 1)

    return {
        dateStart, dateEnd
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