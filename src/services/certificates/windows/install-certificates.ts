import { exec } from 'child_process'
import path from 'path'
import util from 'util'

import { listFiles } from '../../../utils/get-list-files-of-folder'

const execAsync = util.promisify(exec)

export async function installCertificate (fileCertificate: string): Promise<void> {
    const extensionFile = path.extname(fileCertificate)
    const nameFileOriginal = path.basename(fileCertificate)
    const nameFileOriginalSplit = nameFileOriginal.split('-')
    const password = nameFileOriginalSplit[1].replace(extensionFile, '')
    const { stdout, stderr } = await execAsync(`certutil -f -user -p ${password} -importPFX My "${fileCertificate}"`)
    if (stdout) {
        console.log(`- Certificado ${nameFileOriginalSplit[0]} instalado com sucesso`)
    }
    if (stderr) {
        console.log('- Erro ao instalar certificado: ', stderr)
    }
}

export async function installCertificates (directory: string): Promise<void> {
    const listFilesCertificates = await listFiles(directory)
    for (const fileCertificate of listFilesCertificates) {
        await installCertificate(fileCertificate)
    }
}
// installCertificates('C:/_temp/certificados/teste/ok').then(_ => console.log(_))