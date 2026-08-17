$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$nodeRoot = "C:\Program Files\nodejs"
$npm = Join-Path $nodeRoot "npm.cmd"
$npx = Join-Path $nodeRoot "npx.cmd"

if (!(Test-Path -LiteralPath $npm)) {
  throw "npm bulunamadi: $npm"
}

if (!(Test-Path -LiteralPath $npx)) {
  throw "npx bulunamadi: $npx"
}

$env:Path = "$nodeRoot;$env:Path"
Set-Location $projectRoot

Write-Host ""
Write-Host "Bu komut App Store/TestFlight icin production iOS build olusturur ve App Store Connect'e yukler."
Write-Host "Onemli:"
Write-Host "- Proje Expo/EAS bulut build servisine yuklenir."
Write-Host "- Apple Developer Program hesabi gerekir."
Write-Host "- App Store Connect'te bundle id ile app kaydi olmalidir: com.esref.zikrdefteri"
Write-Host "- Yukleme TestFlight/App Store Connect'e gider; App Review'a son gonderim web panelinden yapilir."
Write-Host ""
$confirmation = Read-Host "Devam etmek icin Evet yaz"
if ($confirmation -ne "Evet") {
  Write-Host "Iptal edildi. Build veya submit baslatilmadi."
  exit 0
}

Write-Host ""
Write-Host "1/3 TypeScript kontrolu..."
& $npm run typecheck
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "2/3 Expo hesabina giris kontrol ediliyor..."
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
Write-Host "3/3 Production build ve auto-submit baslatiliyor..."
& $npx --yes eas-cli@latest build --platform ios --profile production --auto-submit
exit $LASTEXITCODE
