import { format } from 'date-fns-tz'
import path from 'path'

import 'dotenv/config'
import { OrganizeCertificates } from '../../services/certificates/organize-certificates'
import { mainDeleteCertificates } from '../../services/certificates/windows/delete-certificates'
import { mainGetCertificates } from '../../services/certificates/windows/get-all-certificates-user-my'
import { mainInstallCertificates } from '../../services/certificates/windows/install-certificates'
import { mainSetDefaultCertificateRegedit } from '../../services/certificates/windows/set-default-certificate-regedit'
import { MainNFGoias } from './MainNFGoias'

class Applicattion {
    private hourLog: string
    private hourLogToCreateFolder: string

    constructor () {
        this.hourLogToCreateFolder = format(new Date(), 'yyyy-MM-dd_hh-mm-ss_a', { timeZone: 'America/Sao_Paulo' })
        this.hourLog = format(new Date(), 'yyyy-MM-dd hh:mm:ss a', { timeZone: 'America/Sao_Paulo' })
    }

    async process (): Promise<void> {
        console.log('1- Organizando certificados')
        await OrganizeCertificates(process.env.FOLDER_CERTIFICATE_ORIGINAL, process.env.FOLDER_CERTIFICATE_COPY)

        console.log('2- Deletando certificados')
        await mainDeleteCertificates(false)

        console.log('3- Instalando certificados')
        await mainInstallCertificates(path.resolve(process.env.FOLDER_CERTIFICATE_COPY, 'ok'))

        console.log('4- Percorrendo certificados')
        const certificates = await mainGetCertificates()
        for (const certificate of certificates) {
            console.log(`- Lendo certificado ${certificate.requerenteCN}`)
            await mainSetDefaultCertificateRegedit('https://nfe.sefaz.go.gov.br', certificate)
            await MainNFGoias()
        }
    }
}

const applicattion = new Applicattion()
applicattion.process().then(_ => console.log(_))

export default Applicattion