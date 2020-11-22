New-Item -Path HKLM:\SOFTWARE\Policies\Google\Chrome -Name AutoSelectCertificateForUrls -Force
Set-Itemproperty -Path HKLM:\SOFTWARE\Policies\Google\Chrome\AutoSelectCertificateForUrls -Name 1 -Value '{"pattern":"https://nfe.sefaz.go.gov.br","filter":{"SUBJECT":{"CN":"A L R ELETRICA EIRELI:18040800000100","OU":"Certificado PJ A1"}}}'
exit