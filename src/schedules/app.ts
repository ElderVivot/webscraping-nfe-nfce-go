import express from 'express'

import NFSeGoiania from './jobs/NFeNFCeGO'
import NFSeGoianiaReprocessErrors from './jobs/NFeNFCeGOReprocessErrors'

const app = express()

async function process () {
    NFSeGoiania.start()
    NFSeGoianiaReprocessErrors.start()
}

process().then(_ => console.log())

export default app