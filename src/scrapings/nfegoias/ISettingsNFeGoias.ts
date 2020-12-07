import TTypeLog from '../../models/TTypeLog'

export interface ISettingsNFeGoias {
    wayCertificate?: string,
    numeroSerie?: string,
    dateHourProcessing?: string,
    hourLog?: string,
    id?: number,
    typeLog?: TTypeLog,
    codeCompanie?: string,
    nameCompanie?: string,
    cgceCompanie?: string,
    modelNF?: string,
    entradasOrSaidas?: string,
    typeNF?: string,
    messageError?: string,
    messageLog?: string,
    messageLogToShowUser?: string,
    error?: string,
    valueLabelSite?: string,
    dateStartDown?: string,
    dateEndDown?: string,
    year?: number,
    month?: string,
    qtdNotes?: number,
    qtdTimesReprocessed?: number
}