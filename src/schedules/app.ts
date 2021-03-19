import express from 'express'

import { jobDay1, jobDay15 } from './jobs/NFeNFCeGO'
import NFeNFCeGOReprocessErrors from './jobs/NFeNFCeGOReprocessErrors'

const app = express()

async function process () {
    jobDay1.start()
    jobDay15.start()
    NFeNFCeGOReprocessErrors.start()
}

process().then(_ => console.log())

export default app