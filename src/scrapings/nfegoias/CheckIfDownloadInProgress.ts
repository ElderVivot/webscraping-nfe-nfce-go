import { Page } from 'puppeteer'

import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

export async function CheckIfDownloadInProgress (page: Page, settings: ISettingsNFeGoias): Promise<number> {
    try {
        return new Promise(resolve => {
            let quantityTimesCheckIfDownloadInProgress = 0

            const interval = setInterval(async () => {
                quantityTimesCheckIfDownloadInProgress++
                console.log(`\t\t\t- Processando à ${quantityTimesCheckIfDownloadInProgress * 5} segundos`)
                const finishDownloadProgress = await page.evaluate(() => {
                    const timeInfoLoading = document.querySelector('#timer-info-loading')
                    let finishedDownload = false
                    const operationFinished: string = document.querySelector('.modal-body > .label-info-loading')?.textContent
                    if (operationFinished) {
                        const operationFinishedSanitize = operationFinished.replace(/[^a-zA-Z/ -]/g, '').toUpperCase()
                        console.log(operationFinishedSanitize)
                        if (operationFinishedSanitize.indexOf('OPERACAO CONCLUIDA')) finishedDownload = true
                    }

                    // let downloadAllNotes = false
                    // const qtdNotesOriginal: string = document.querySelector('#dnwld-all-num-elemnts')?.textContent
                    // if (qtdNotesOriginal) {
                    //     const qtdNotesInProgress = Number(qtdNotesOriginal.split(':')[1].split('/')[0])
                    //     const qtdNotesTotal = Number(qtdNotesOriginal.split(':')[1].split('/')[1])
                    //     if (qtdNotesInProgress === qtdNotesTotal) downloadAllNotes = true
                    // }
                    if (!timeInfoLoading && finishedDownload) {
                        return 1
                    } else {
                        return 0
                    }
                })
                if (finishDownloadProgress) {
                    clearInterval(interval)
                    resolve(finishDownloadProgress)
                }
            }, 5000)
        })
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'CheckIfDownloadInProgress'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao checar se o download das notas ainda está em progresso.'
        console.log(`\t\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings)
        await treatsMessageLog.saveLog()
    }
}