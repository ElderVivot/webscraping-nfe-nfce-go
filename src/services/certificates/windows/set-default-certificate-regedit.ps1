New-Item -Path HKLM:\SOFTWARE\Policies\Google\Chrome -Name AutoSelectCertificateForUrls -Force
Set-Itemproperty -Path HKLM:\SOFTWARE\Policies\Google\Chrome\AutoSelectCertificateForUrls -Name 1 -Value '{"pattern":"https://nfe.sefaz.go.gov.br","filter":{"SUBJECT":{"CN":"ANNA CUNHA INDUSTRIA E CONFECCOES EIRELI:18130122000168"}}}'
exit