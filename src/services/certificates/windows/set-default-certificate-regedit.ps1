New-Item -Path HKLM:\SOFTWARE\Policies\Google\Chrome -Name AutoSelectCertificateForUrls -Force
Set-Itemproperty -Path HKLM:\SOFTWARE\Policies\Google\Chrome\AutoSelectCertificateForUrls -Name 1 -Value '{"pattern":"https://nfe.sefaz.go.gov.br","filter":{"SUBJECT":{"CN":"100 LIMIT''S MOTORSPORTS EIRELI:04605182000266"}}}'
exit