$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$nodeRoot = "C:\Program Files\nodejs"
$npx = Join-Path $nodeRoot "npx.cmd"

if (!(Test-Path -LiteralPath $npx)) {
  throw "npx bulunamadi: $npx"
}

$env:Path = "$nodeRoot;$env:Path"
Set-Location $projectRoot

Write-Host ""
Write-Host "Bu komut gercek iPhone uygulamasi icin EAS iOS build baslatir."
Write-Host "Onemli:"
Write-Host "- Proje Expo/EAS bulut build servisine yuklenir."
Write-Host "- Apple Developer Program hesabi gerekir."
Write-Host "- iPhone UDID kaydi yapilir; yalniz kayitli cihazlar kurabilir."
Write-Host "- Bu islem Expo ve Apple hesaplarinda oturum acmayi gerektirebilir."
Write-Host ""
$confirmation = Read-Host "Devam etmek icin Evet yaz"
if ($confirmation -ne "Evet") {
  Write-Host "Iptal edildi. Herhangi bir build baslatilmadi."
  exit 0
}

Write-Host ""
Write-Host "1/3 Expo hesabina giris kontrol ediliyor..."
& $npx --yes eas-cli@latest whoami
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Expo hesabina giris yapiliyor..."
  & $npx --yes eas-cli@latest login
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

Write-Host ""
Write-Host "2/3 iPhone cihaz kaydi baslatiliyor..."
Write-Host "Aciklama: EAS sana bir QR/link verir. Bunu iPhone'da acip cihaz profilini kaydet."
& $npx --yes eas-cli@latest device:create
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "3/3 iOS preview build baslatiliyor..."
Write-Host "Build bitince terminaldeki veya Expo dashboard'daki Install linkini iPhone'da ac."
& $npx --yes eas-cli@latest build --platform ios --profile preview
exit $LASTEXITCODE
