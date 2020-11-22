import pem from 'pem'
import util from 'util'

const readPkcs12Async = util.promisify(
    (bufferOrPath: string | Buffer, options: pem.Pkcs12ReadOptions, cb: pem.Callback<pem.Pkcs12ReadResult>) => pem.readPkcs12(
        bufferOrPath, options, (err, result) => cb(err, result)
    )
)
const readCertificateInfoAsyn = util.promisify(
    (certificate: string, cb: pem.Callback<pem.CertificateSubjectReadResult>) => pem.readCertificateInfo(
        certificate, (err, result) => cb(err, result)
    )
)

export async function ReadCertificate (pathCertificate: string, password: string) : Promise<pem.CertificateSubjectReadResult> {
    try {
        const certificate = await readPkcs12Async(pathCertificate, { p12Password: password })
        const certificateInfo = await readCertificateInfoAsyn(certificate.cert)
        return certificateInfo
    } catch (error) {
        return {
            country: '',
            state: '',
            locality: '',
            organization: '',
            organizationUnit: '',
            commonName: 'invalid_password',
            emailAddress: ''
        }
    }
}

// ReadCertificate('C:/_temp/certificados/agm_caetano_soma123.pfx', 'soma123').then(_ => console.log(_))

// pem.readPkcs12(wayPfx, { p12Password: 'soma123' }, (err, cert) => {
//     if (err) console.log(err)
//     pem.readCertificateInfo(cert.cert, (err, cert) => {
//         if (err) console.log(err)
//         return cert
//     })
// })