import { format } from 'date-fns-tz'
import path from 'path'

import 'dotenv/config'
import { OrganizeCertificates } from '../../services/certificates/organize-certificates'
import { mainDeleteCertificates } from '../../services/certificates/windows/delete-certificates'
import { mainGetCertificates } from '../../services/certificates/windows/get-all-certificates-user-my'
import { installCertificate } from '../../services/certificates/windows/install-certificates'
import { mainSetDefaultCertificateRegedit } from '../../services/certificates/windows/set-default-certificate-regedit'
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
            const nameFile = path.basename(fileCertificate).split('-')[0]

            console.log('\n*- Deletando certificados')
            await mainDeleteCertificates(false)

            console.log(`\n*- Instalando certificado ${nameFile}`)
            await installCertificate(fileCertificate)

            const certificates = await mainGetCertificates()
            const certificate = certificates[0]
            if (certificate.typeCgceCertificate === 'CPF') {
                console.log(`- Certificado ${certificate.requerenteCN} é um CPF, parando processamento.`)
                console.log('------------------------------------------')
                continue
            }

            const nameCertificate = certificate.requerenteCN.split(':')[0]
            console.log(`\n*- Lendo certificado ${certificate.requerenteCN}`)
            await mainSetDefaultCertificateRegedit('https://nfe.sefaz.go.gov.br', certificate)
            // await new Promise((resolve) => setTimeout(() => resolve('teste'), 10000))
            try {
                await MainNFGoias({
                    wayCertificate: fileCertificate,
                    hourLog: this.hourLog,
                    dateHourProcessing: this.hourLogToCreateFolder,
                    nameCompanie: nameCertificate
                })
            } catch (error) {
                console.log('*- Erro ao processar busca de notas.')
            }
            console.log('------------------------------------------')
        }

        // console.log('4- Percorrendo certificados')
        // const certificates = await mainGetCertificates()
        // for (const certificate of certificates) {
        //     const nameCertificate = certificate.requerenteCN.split(':')[0]
        //     console.log(`- Lendo certificado ${certificate.requerenteCN}`)
        //     await mainSetDefaultCertificateRegedit('https://nfe.sefaz.go.gov.br', certificate)
        //     // await new Promise((resolve) => setTimeout(() => resolve('teste'), 10000))
        //     await MainNFGoias({
        //         hourLog: this.hourLog,
        //         dateHourProcessing: this.hourLogToCreateFolder,
        //         nameCompanie: nameCertificate
        //     })
        // }
    }
}

const applicattion = new Applicattion()
applicattion.process().then(_ => console.log(_))

export default Applicattion