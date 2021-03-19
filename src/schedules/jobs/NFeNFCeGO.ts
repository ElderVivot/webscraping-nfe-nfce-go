import { CronJob } from 'cron'

import NFeNFCeGO from '../../scrapings/nfegoias/index'

async function processNotes () {
    const applicattion = new NFeNFCeGO()
    await applicattion.process()
}

const jobDay15 = new CronJob(
    '0 22 15 * *',
    async function () {
        await processNotes()
    },
    null,
    true
)

const jobDay1 = new CronJob(
    '0 4 1 * *',
    async function () {
        await processNotes()
    },
    null,
    true
)

export { jobDay15, jobDay1 }