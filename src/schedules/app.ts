import express from 'express'

import { job } from './jobs/NFeNFCeGO'
import { job1, job2, job3, job4 } from './jobs/NFeNFCeGOReprocessErrors'

const app = express()

async function process () {
    job.start()
    // jobDay15.start()
    job1.start()
    job2.start()
    job3.start()
    job4.start()
}

process().then(_ => console.log())

export default app