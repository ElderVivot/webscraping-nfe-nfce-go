New-Item -Path HKLM:\SOFTWARE\Policies\Google\Chrome -Name AutoSelectCertificateForUrls -Force
Set-Itemproperty -Path HKLM:\SOFTWARE\Policies\Google\Chrome\AutoSelectCertificateForUrls -Name 1 -Value '{"pattern":"https://nfe.sefaz.go.gov.br","filter":{"SUBJECT":{"CN":"SHIFT FITNESS - ACADEMIA ALPHA LTDA:32512850000165"}}}'
exit