import { format } from 'date-fns-tz'
import { tmpdir } from 'os'
import path from 'path'

import 'dotenv/config'
import { OrganizeCertificates } from '../../services/certificates/organize-certificates'
import { prepareCertificateRegedit } from '../../services/certificates/windows/prepare-certificate-regedit'
import { DeleteFolder } from '../../services/delete-folders'
import { listFiles } from '../../utils/get-list-files-of-folder'
import { MainNFGoias } from './MainNFGoias'

class Applicattion {
    private hourLog: string
    private hourLogToCreateFolder: string

    constructor () {
        this.hourLogToCreateFolder = format(new Date(), 'yyyy-MM-dd_hh-mm-ss_a', { timeZone: 'America/Sao_Paulo' })
        this.hourLog = format(new Date(), 'yyyy-MM-dd hh:mm:ss a', { timeZone: 'America/Sao_Paulo' })
    }

    async process (): Promise<void> {
        console.log('*- Organizando certificados')
        await OrganizeCertificates(process.env.FOLDER_CERTIFICATE_ORIGINAL, process.env.FOLDER_CERTIFICATE_COPY)

        const listFilesCertificates = await listFiles(path.resolve(process.env.FOLDER_CERTIFICATE_COPY, 'ok'))
        for (const fileCertificate of listFilesCertificates) {
            try {
                const certificate = await prepareCertificateRegedit(fileCertificate)

                await MainNFGoias({
                    wayCertificate: fileCertificate,
                    hourLog: this.hourLog,
                    dateHourProcessing: this.hourLogToCreateFolder,
                    nameCompanie: certificate.nameCertificate
                })

                // it's necessary to close chromiumm withoud error
                await new Promise((resolve) => setTimeout(() => resolve(''), 5000))

                console.log('*- Deletando pastas com o nome puppeteer_dev_chrome do %temp% do user')
                await DeleteFolder(tmpdir(), 'puppeteer_dev_chrome', true)
            } catch (error) {
                console.log(`*- Erro ao processar certificado ${fileCertificate}. O erro é ${error}`)
            }
            console.log('------------------------------------------')
        }
    }
}

const applicattion = new Applicattion()
applicattion.process().then(_ => console.log(_))

export default Applicattion