import { CronJob } from 'cron'

import NFeNFCeGO from '../../scrapings/nfegoias/index'

async function processNotes () {
    const applicattion = new NFeNFCeGO()
    await applicattion.process()
}

const job = new CronJob(
    '00 19 * * *',
    async function () {
        await processNotes()
    },
    null,
    true
)

export default job