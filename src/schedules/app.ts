import express from 'express'

import { job } from './jobs/NFeNFCeGO'
import { job1 } from './jobs/NFeNFCeGOReprocessErrors'

const app = express()

async function process () {
    job.start()
    job1.start()
}

process().then(_ => console.log())

export default app