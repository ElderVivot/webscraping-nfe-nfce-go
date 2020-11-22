import { exec } from 'child_process'
import fs from 'fs'
// import Shell from 'node-powershell'
import path from 'path'
import util from 'util'

import { ICertifate } from '../i-certificate'

const execAsync = util.promisify(exec)

export async function mainSetDefaultCertificateRegedit (url: string, certificade: ICertifate): Promise<void> {
    const pathSetDefaultCertificateRegedit = path.resolve(__dirname, 'set-default-certificate-regedit.ps1')
    const textCommand = `New-Item -Path HKLM:\\SOFTWARE\\Policies\\Google\\Chrome -Name AutoSelectCertificateForUrls -Force
Set-Itemproperty -Path HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\AutoSelectCertificateForUrls -Name 1 -Value '{"pattern":"${url}","filter":{"SUBJECT":{"CN":"${certificade.requerenteCN}","OU":"${certificade.requerenteOU}"}}}'
exit`

    fs.writeFile(
        pathSetDefaultCertificateRegedit,
        textCommand,
        error => {
            if (error) console.log(error)
        }
    )
    await execAsync(`powershell -Command "Start-Process powershell -ArgumentList '-noprofile -file ${pathSetDefaultCertificateRegedit}' -Verb RunAs`)
    // await execAsync('powershell -Command "Start-Process -FilePath powershell -Verb RunAs -ArgumentList \'New-Item -Path HKLM:\\SOFTWARE\\Policies\\Google\\Chrome -Name AutoSelectCertificateForUrls -Force\'"')
    // const { stdout, stderr } = await execAsync(`powershell -Command "Start-Process -FilePath powershell -Verb RunAs -ArgumentList 'Set-Itemproperty -Path HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\AutoSelectCertificateForUrls -Name 1 -Value '{"pattern":"${url}","filter":{"SUBJECT":{"CN":"AGF ${certificade.requerenteCN}","OU":"${certificade.requerenteOU}"}}}''"`)
    // const { stdout, stderr } = await execAsync('powershell -Command "Set-Itemproperty -Path HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\AutoSelectCertificateForUrls -Name 1 -Value \'{"pattern":"https://nfe.sefaz.go.gov.br","filter":{"SUBJECT":{"CN":"AGF COMERCIO DE BRINQUEDOS LTDA:18122845000115","OU":"Certificado PJ A1"}}}\'"')
    // const { stdout, stderr } = await execAsync('powershell -Command "Start-Process -FilePath powershell -Verb RunAs -ArgumentList \'Set-Itemproperty -Path HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\AutoSelectCertificateForUrls -Name 1 -Value {\"teste\":\"123\",\"teste2\":\"123\"}\'"')
    // const { stdout, stderr } = await execAsync(`REG ADD HKLM\\SOFTWARE\\Policies\\Google\\Chrome\\AutoSelectCertificateForUrls /v 1 /d {""pattern"":""${url}"",""filter"":{""SUBJECT"":{""CN"":""${certificade.requerenteCN}"",""OU"":""${certificade.requerenteOU}""}}} /f`)
    // const { stdout, stderr } = await execAsync(`REG ADD HKLM\\SOFTWARE\\Policies\\Google\\Chrome\\AutoSelectCertificateForUrls /v 1 /d {"pattern":"${url}","filter":{"SUBJECT":{"CN":"${certificade.requerenteCN}","OU":"${certificade.requerenteOU}"}}} /f`)
    // console.log(stdout, stderr)
    // const ps = new Shell({
    //     executionPolicy: 'Bypass',
    //     noProfile: true
    // })

    // await ps.addCommand('Start-Process PowerShell -Verb RunAs')
    // await ps.addCommand("'New-Item -Path HKLM:\\SOFTWARE\\Policies\\Google\\Chrome -Name AutoSelectCertificateForUrls -Force'")
    // await ps.addCommand('Start-Process -FilePath powershell -Verb RunAs -ArgumentList')
    // await ps.addCommand(`Set-Itemproperty -Path HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\AutoSelectCertificateForUrls -Name 1 -Value '{"pattern":"${url}","filter":{"SUBJECT":{"CN":"${certificade.requerenteCN}","OU":"${certificade.requerenteOU}"}}}'`)
    // await ps.addCommand('exit')
    // await ps.invoke()
    // ps.invoke().then(_ => console.log(_)).catch(_ => console.log(_))
}

mainSetDefaultCertificateRegedit('https://nfe.sefaz.go.gov.br', {
    notAfter: new Date(),
    notBefore: new Date(),
    numeroSerie: '',
    requerenteCN: 'A L R ELETRICA EIRELI:18040800000100',
    requerenteOU: 'Certificado PJ A1'
}).then(_ => console.log(_))