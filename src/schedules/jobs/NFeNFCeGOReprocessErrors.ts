import { CronJob } from 'cron'
import { format } from 'date-fns-tz'

import GetLogNfeNfceErrors from '../../controllers/GetLogNfeNfceErrors'
import { MainNFGoias } from '../../scrapings/nfegoias/MainNFGoias'
import { prepareCertificateRegedit } from '../../services/certificates/windows/prepare-certificate-regedit'

async function processNotes () {
    const getLogNfeNfceErrors = new GetLogNfeNfceErrors()
    const logNfeNfceErrors = await getLogNfeNfceErrors.get()
    if (logNfeNfceErrors) {
        for (const log of logNfeNfceErrors) {
            const hourLogToCreateFolder = format(new Date(), 'yyyy-MM-dd_hh-mm-ss_a', { timeZone: 'America/Sao_Paulo' })
            const hourLog = format(new Date(), 'yyyy-MM-dd hh:mm:ss a', { timeZone: 'America/Sao_Paulo' })

            try {
                const certificate = await prepareCertificateRegedit(log.wayCertificate)

                await MainNFGoias({
                    id: log.id,
                    dateHourProcessing: hourLogToCreateFolder,
                    hourLog: hourLog,
                    wayCertificate: log.wayCertificate,
                    cgceCompanie: log.cgceCompanie,
                    nameCompanie: certificate.nameCertificate,
                    modelNF: log.modelNF,
                    qtdTimesReprocessed: log.qtdTimesReprocessed,
                    dateStartDown: log.dateStartDown,
                    dateEndDown: log.dateEndDown
                })
            } catch (error) {
                console.log(`*- Erro ao processar certificado ${log.wayCertificate}. O erro é ${error}`)
            }
        }
    }
}

const job = new CronJob(
    '0 */3 * * *',
    async function () {
        try {
            await processNotes()
        } catch (error) {
            console.log(`- Erro ao reprocessar erros: ${error}`)
        }
    },
    null,
    true
)

export default job

// processNotes().then(_ => console.log(_))