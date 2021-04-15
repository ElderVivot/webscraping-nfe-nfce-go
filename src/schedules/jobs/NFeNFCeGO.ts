import { CronJob } from 'cron'

import NFeNFCeGO from '../../scrapings/nfegoias/index'

async function processNotes () {
    try {
        const applicattion = new NFeNFCeGO()
        await applicattion.process()
    } catch (error) {
        console.log(`- Erro ao processar baixa de notas ${error}`)
    }
}

const job = new CronJob(
    '0 1 * * *',
    async function () {
        await processNotes()
    },
    null,
    true
)

// const jobDay1 = new CronJob(
//     '0 4 1 * *',
//     async function () {
//         await processNotes()
//     },
//     null,
//     true
// )

export { job }