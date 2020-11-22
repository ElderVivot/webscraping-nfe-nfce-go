import IPeriodToDownNotes from '../../models/IPeriodToDownNotes'
import * as functions from '../../utils/functions'

interface IDateInicialAndFinal {
    inicialDate: string
    finalDate: string
}

export function SetDateInicialAndFinalOfMonth (periodToDown: IPeriodToDownNotes, month: number, year: number): IDateInicialAndFinal {
    const yearInicial = periodToDown.dateStart.getFullYear()
    const yearFinal = periodToDown.dateEnd.getFullYear()
    const monthInicial = periodToDown.dateStart.getMonth() + 1
    const monthFinal = periodToDown.dateEnd.getMonth() + 1

    const daysInitialAndFinalOfMonth = functions.daysInitialAndEndOfMonth(month, year)
    const dateInicialAndFinal: IDateInicialAndFinal = { inicialDate: null, finalDate: null }

    if (month === monthInicial && month === monthFinal && year === yearInicial && year === yearFinal) {
        dateInicialAndFinal.inicialDate = functions.convertDateToString(periodToDown.dateStart)
        dateInicialAndFinal.finalDate = functions.convertDateToString(periodToDown.dateEnd)
    } else if (month === monthInicial && year === yearInicial) {
        dateInicialAndFinal.inicialDate = functions.convertDateToString(periodToDown.dateStart)
        dateInicialAndFinal.finalDate = functions.convertDateToString(daysInitialAndFinalOfMonth.dateFinal)
    } else if (month === monthFinal && year === yearFinal) {
        dateInicialAndFinal.inicialDate = functions.convertDateToString(daysInitialAndFinalOfMonth.dateInitial)
        dateInicialAndFinal.finalDate = functions.convertDateToString(periodToDown.dateEnd)
    } else {
        dateInicialAndFinal.inicialDate = functions.convertDateToString(daysInitialAndFinalOfMonth.dateInitial)
        dateInicialAndFinal.finalDate = functions.convertDateToString(daysInitialAndFinalOfMonth.dateFinal)
    }
    return dateInicialAndFinal
}