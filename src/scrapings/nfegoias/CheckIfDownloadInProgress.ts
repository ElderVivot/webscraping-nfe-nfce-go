import { Page } from 'puppeteer'

import { promiseTimeOut } from '../../utils/promise-timeout'
import { ISettingsNFeGoias } from './ISettingsNFeGoias'
import { TreatsMessageLogNFeGoias } from './TreatsMessageLogNFGoias'

async function downloadInProgress (page: Page): Promise<string> {
    return new Promise(resolve => {
        let quantityTimesCheckIfDownloadInProgress = 0

        const interval = setInterval(async () => {
            quantityTimesCheckIfDownloadInProgress++
            console.log(`\t\t\t- Processando à ${quantityTimesCheckIfDownloadInProgress * 5} segundos`)
            const finishDownloadProgress = await page.evaluate(() => {
                const modalIsOpen = document.querySelector('.modal-body')
                const timeInfoLoading = document.querySelector('#timer-info-loading')
                let finishedDownload = false
                const operationFinished: string = document.querySelector('.modal-body > .label-info-loading')?.textContent
                if (operationFinished) {
                    const operationFinishedSanitize = operationFinished.replace(/[^a-zA-Z/ -]/g, '').toUpperCase()
                    console.log(operationFinishedSanitize)
                    if (operationFinishedSanitize.indexOf('OPERACAO CONCLUIDA')) finishedDownload = true
                }
                if (!modalIsOpen) {
                    return -1
                }
                if (!timeInfoLoading && finishedDownload) {
                    return 1
                } else {
                    return 0
                }
            })
            if (finishDownloadProgress) {
                clearInterval(interval)
                resolve(`${finishDownloadProgress}`)
            }
        }, 5000)
    })
}

export async function CheckIfDownloadInProgress (page: Page, settings: ISettingsNFeGoias): Promise<void> {
    try {
        const downloadProgress = Promise.race([downloadInProgress(page), promiseTimeOut(1200000)])
        if (downloadProgress === 'TIME_EXCEED') {
            throw 'TIME EXCEED - DOWNLOAD PROGRESS'
        }
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'CheckIfDownloadInProgress'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao checar se o download das notas ainda está em progresso.'
        if (error === 'MODEL_WITH_BUTTON_DOWN_IS_NOT_OPEN') {
            settings.messageLogToShowUser = 'Modal de download não está sendo exibido.'
        }
        console.log(`\t[Final-Empresa-Mes] - ${settings.messageLogToShowUser}`)
        console.log('\t-------------------------------------------------')

        const treatsMessageLog = new TreatsMessageLogNFeGoias(page, settings, null, true)
        await treatsMessageLog.saveLog()
    }
}