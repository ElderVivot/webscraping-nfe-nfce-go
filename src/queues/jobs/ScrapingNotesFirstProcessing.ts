import 'dotenv/config'
import { prepareCertificateRegedit } from 'src/services/certificates/windows/prepare-certificate-regedit'

import { ISettingsNFeGoias } from '../../scrapings/nfegoias/ISettingsNFeGoias'
import { MainNFGoiasAddQueueToProcess } from '../../scrapings/nfegoias/MainNFGoiasAddQueueToProcess'

export const ScrapingNotesFirstProcessing = {
    key: 'ScrapingNotesFirstProcessing',
    async handle ({ data }): Promise<void> {
        const settings: ISettingsNFeGoias = data.settings
        const certificate = await prepareCertificateRegedit(settings.wayCertificate)

        await MainNFGoiasAddQueueToProcess({
            wayCertificate: settings.wayCertificate,
            hourLog: settings.hourLog,
            dateHourProcessing: settings.dateHourProcessing,
            nameCompanie: certificate.nameCertificate
        })
        await new Promise((resolve) => setTimeout(() => resolve(''), 1000))
        return Promise.resolve()
    }
}