import { CronJob } from 'cron'
import { format } from 'date-fns-tz'
import { tmpdir } from 'os'

import GetLogNfeNfceErrors from '../../controllers/GetLogNfeNfceErrors'
import { MainNFGoias } from '../../scrapings/nfegoias/MainNFGoias'
import { prepareCertificateRegedit } from '../../services/certificates/windows/prepare-certificate-regedit'
import { DeleteFolder } from '../../services/delete-folders'

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

                console.log('*- Deletando pastas com o nome puppeteer_dev_chrome do %temp% do user')
                await DeleteFolder(tmpdir(), 'puppeteer_dev_chrome', true)
            } catch (error) {
                console.log(`*- Erro ao processar certificado ${log.wayCertificate}. O erro é ${error}`)
            }
        }
    }
}

const job1 = new CronJob(
    '0 6 * * *',
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

const job2 = new CronJob(
    '0 10 * * *',
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

const job3 = new CronJob(
    '0 14 * * *',
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

const job4 = new CronJob(
    '0 18 * * *',
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

export { job1, job2, job3, job4 }

// processNotes().then(_ => console.log(_))