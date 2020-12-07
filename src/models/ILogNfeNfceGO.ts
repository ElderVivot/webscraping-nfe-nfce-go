import TTypeLog from './TTypeLog'

export default interface ILogNfeNfceGO {
    id?: number,
    wayCertificate?: string,
    cgceCompanie?: string
    codeCompanie?: string
    nameCompanie?: string
    modelNF?: string
    hourLog?: string
    dateStartDown?: string
    dateEndDown?: string
    typeLog?: TTypeLog
    messageLog?: string
    messageLogToShowUser?: string
    messageError?: string
    urlImageDown?: string
    qtdNotesDown?: number
    qtdTimesReprocessed?: number
}