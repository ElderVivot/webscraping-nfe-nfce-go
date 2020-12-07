import { exec } from 'child_process'
import util from 'util'

import { convertStringToDate } from '../../../utils/treat-date'
import { treatText } from '../../../utils/treat-text'
import { ICertifate } from '../i-certificate'

const execAsync = util.promisify(exec)

function clearDataCertificate (): ICertifate {
    return {
        numeroSerie: '',
        notBefore: null,
        notAfter: null,
        requerenteCN: '',
        requerenteOU: ''
    }
}

const certificates: Array<ICertifate> = []

function getDataCertificate (stdoutSplit: Array<string>): void {
    let certificate: ICertifate
    for (const line of stdoutSplit) {
        if (!line) continue
        const lineFormated = treatText(line)
        const lineTrim = line.trim()
        const lineTrimSplit = lineTrim.split(':')
        const fieldTwo = lineTrimSplit[1]?.trim()
        if (lineFormated.indexOf('==== CERTIFICADO') >= 0) {
            certificate = clearDataCertificate()
        } else if (lineFormated.indexOf('NMERO DE SRIE:') >= 0) {
            certificate.numeroSerie = fieldTwo
        } else if (lineFormated.indexOf('NOTBEFORE:') >= 0) {
            certificate.notBefore = convertStringToDate(fieldTwo.substring(0, 10), 'dd/MM/yyyy')
        } else if (lineFormated.indexOf('NOTAFTER:') >= 0) {
            certificate.notAfter = convertStringToDate(fieldTwo.substring(0, 10), 'dd/MM/yyyy')
        } else if (lineFormated.indexOf('REQUERENTE:') >= 0) {
            certificate.requerenteCN = lineTrim.split('CN=')[1].split(',')[0]
            certificate.requerenteOU = lineTrim.split('OU=')[1].split(',')[0]
            certificates.push(certificate)
        }
    }
}

export async function mainGetCertificates (): Promise<Array<ICertifate>> {
    certificates.splice(0, certificates.length)
    const { stdout, stderr } = await execAsync('certutil -store -user My')
    let stdoutSplit: Array<string>
    if (stdout) {
        stdoutSplit = stdout.split('\r\n')
        getDataCertificate(stdoutSplit)
    }
    if (stderr) {
        console.log('- Erro ao ler certificados instalados em Usuario/Pessoal: ', stderr)
    }
    return certificates
}
// mainGetCertificates().then(_ => console.log(_))