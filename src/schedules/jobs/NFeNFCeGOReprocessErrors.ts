import { CronJob } from 'cron'
import { format } from 'date-fns-tz'

import GetLogNfeNfceErrors from '../../controllers/GetLogNfeNfceErrors'
import { MainNFGoias } from '../../scrapings/nfegoias/MainNFGoias'

async function processNotes () {
    const getLogNfeNfceErrors = new GetLogNfeNfceErrors()
    const logNfeNfceErrors = await getLogNfeNfceErrors.get()
    if (logNfeNfceErrors) {
        for (const log of logNfeNfceErrors) {
            const hourLogToCreateFolder = format(new Date(), 'yyyy-MM-dd_hh-mm-ss_a', { timeZone: 'America/Sao_Paulo' })
            const hourLog = format(new Date(), 'yyyy-MM-dd hh:mm:ss a', { timeZone: 'America/Sao_Paulo' })
            await MainNFGoias({
                id: log.id,
                dateHourProcessing: hourLogToCreateFolder,
                hourLog: hourLog,
                wayCertificate: log.wayCertificate,
                cgceCompanie: log.cgceCompanie,
                modelNF: log.modelNF,
                qtdTimesReprocessed: log.qtdTimesReprocessed,
                dateStartDown: log.dateStartDown,
                dateEndDown: log.dateEndDown
            })
        }
    }
}

const job = new CronJob(
    '0 */3 * * *',
    async function () {
        await processNotes()
    },
    null,
    true
)

export default job