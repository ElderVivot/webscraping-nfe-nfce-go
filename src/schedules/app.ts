import express from 'express'

import { job } from './jobs/NFeNFCeGO'
import NFeNFCeGOReprocessErrors from './jobs/NFeNFCeGOReprocessErrors'

const app = express()

async function process () {
    job.start()
    // jobDay15.start()
    NFeNFCeGOReprocessErrors.start()
}

process().then(_ => console.log())

export default app