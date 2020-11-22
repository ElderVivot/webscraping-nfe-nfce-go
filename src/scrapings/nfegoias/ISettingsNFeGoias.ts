import TTypeLog from '../../models/TTypeLog'

export interface ISettingsNFeGoias {
    numeroSerie?: string,
    dateHourProcessing?: string,
    hourLog?: string,
    id?: number,
    typeLog?: TTypeLog,
    codeCompanie?: string,
    nameCompanie?: string,
    cgceCompanie?: string,
    inscricaoMunicipal?: string,
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