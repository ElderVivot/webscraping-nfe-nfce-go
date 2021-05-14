import { CronJob } from 'cron'
import { format } from 'date-fns-tz'

import GetLogNfeNfceErrors from '../../controllers/GetLogNfeNfceErrors'
import { scrapingNotes } from '../../queues/lib/ScrapingNotes'
import { ISettingsNFeGoias } from '../../scrapings/nfegoias/ISettingsNFeGoias'

async function processNotes () {
    const getLogNfeNfceErrors = new GetLogNfeNfceErrors()
    const logNfeNfceErrors = await getLogNfeNfceErrors.get()
    if (logNfeNfceErrors) {
        for (const log of logNfeNfceErrors) {
            const hourLogToCreateFolder = format(new Date(), 'yyyy-MM-dd_hh-mm-ss_a', { timeZone: 'America/Sao_Paulo' })
            const hourLog = format(new Date(), 'yyyy-MM-dd hh:mm:ss a', { timeZone: 'America/Sao_Paulo' })

            try {
                const settings: ISettingsNFeGoias = {
                    id: log.id,
                    dateHourProcessing: hourLogToCreateFolder,
                    hourLog: hourLog,
                    wayCertificate: log.wayCertificate,
                    cgceCompanie: log.cgceCompanie,
                    modelNF: log.modelNF,
                    qtdTimesReprocessed: log.qtdTimesReprocessed,
                    dateStartDown: log.dateStartDown,
                    dateEndDown: log.dateEndDown
                }
                await scrapingNotes.add({
                    settings
                })

                console.log(`*- Reprocessando scraping ${settings.id} referente ao certificado ${settings.wayCertificate} modelo periodo ${settings.dateStartDown} a ${settings.dateEndDown} modelo ${settings.modelNF}`)
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