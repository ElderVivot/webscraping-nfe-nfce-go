import Queue from 'bull'
import { ISettingsNFeGoias } from 'src/scrapings/nfegoias/ISettingsNFeGoias'

import redisConfig from '../../config/redis'
import SaveLogNfeNfceGO from '../../controllers/SaveLogNfeNfceGO'
import SaveXMLsNFeNFCGO from '../jobs/SaveXMLsNFeNFCGO'

const saveXMLsNFeNFCGO = new Queue(SaveXMLsNFeNFCGO.key, { redis: redisConfig })

saveXMLsNFeNFCGO.on('failed', async (job, error) => {
    const settings: ISettingsNFeGoias = job.data.settings
    const saveLogNfeNfceGO = new SaveLogNfeNfceGO()
    await saveLogNfeNfceGO.saveLog({
        id: settings.id,
        hourLog: settings.hourLog,
        typeLog: 'error',
        messageLog: 'ErrorToProcessDataInQueue',
        messageLogToShowUser: 'Erro ao salvar XMLs na pasta.',
        messageError: error.message,
        urlImageDown: '',
        codeCompanie: settings.codeCompanie,
        nameCompanie: settings.nameCompanie,
        cgceCompanie: settings.cgceCompanie,
        modelNF: settings.modelNF,
        dateStartDown: settings.dateStartDown,
        dateEndDown: settings.dateEndDown,
        qtdNotesDown: settings.qtdNotes,
        qtdTimesReprocessed: settings.qtdTimesReprocessed
    })

    console.log('Job failed', `ID ${settings.id} | ${settings.codeCompanie} - ${settings.nameCompanie} - ${settings.cgceCompanie} | ${settings.modelNF} | ${settings.dateStartDown} - ${settings.dateEndDown}`)
})

saveXMLsNFeNFCGO.on('completed', async (job) => {
    const settings: ISettingsNFeGoias = job.data.settings
    const saveLogNfeNfceGO = new SaveLogNfeNfceGO()
    await saveLogNfeNfceGO.saveLog({
        id: settings.id,
        wayCertificate: settings.wayCertificate,
        hourLog: settings.hourLog,
        typeLog: 'success',
        messageLog: 'SucessToSaveNotes',
        messageLogToShowUser: 'Notas salvas com sucesso',
        messageError: '',
        urlImageDown: '',
        codeCompanie: settings.codeCompanie,
        nameCompanie: settings.nameCompanie,
        cgceCompanie: settings.cgceCompanie,
        modelNF: settings.modelNF,
        dateStartDown: settings.dateStartDown,
        dateEndDown: settings.dateEndDown,
        qtdNotesDown: settings.qtdNotes,
        qtdTimesReprocessed: settings.qtdTimesReprocessed
    })
})

export default saveXMLsNFeNFCGO