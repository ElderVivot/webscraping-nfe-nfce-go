import 'dotenv/config'
import SaveXMLsNFeNFCGO from './jobs/SaveXMLsNFeNFCGO'
import { ScrapingNotes } from './jobs/ScrapingNotes'
import SaveXMLsNFeNFCGOLib from './lib/SaveXMLsNFeNFCGO'
import { scrapingNotes } from './lib/ScrapingNotes'

SaveXMLsNFeNFCGOLib.process(SaveXMLsNFeNFCGO.handle)
scrapingNotes.process(ScrapingNotes.handle)