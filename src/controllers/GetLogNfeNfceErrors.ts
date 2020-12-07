import api from '../services/api'

interface ILogNfeNfceErrors {
    id: number,
    wayCertificate: string,
    cgceCompanie: string,
    modelNF: string,
    dateStartDown: string,
    dateEndDown: string,
    qtdTimesReprocessed: number
}

export default class GetLogNfeNfceErrors {
    async get (): Promise<ILogNfeNfceErrors[] | void> {
        try {
            const logNfeNfceErrors = await api.get('/log_nfe_nfce_go_errors')
            if (logNfeNfceErrors.status === 200) {
                return logNfeNfceErrors.data
            }
        } catch (error) {
            console.log(`- [controllers-GetLogNfeNfceErrors] --> Error --> ${error}`)
        }
    }
}