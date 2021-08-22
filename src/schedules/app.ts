import express from 'express'

import { job } from './jobs/NFeNFCeGO'
import { jobError, jobProcessing } from './jobs/NFeNFCeGOReprocessErrorsOrProcessing'

const app = express()

async function process () {
    job.start()
    jobError.start()
    jobProcessing.start()
}

process().then(_ => console.log())

export default app