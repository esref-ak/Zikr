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
Write-Host "Bu komut EAS'teki son iOS production build'ini App Store Connect'e yukler."
Write-Host "Yeni build olusturmaz; sadece mevcut build'i submit eder."
Write-Host ""
$confirmation = Read-Host "Devam etmek icin Evet yaz"
if ($confirmation -ne "Evet") {
  Write-Host "Iptal edildi. Submit baslatilmadi."
  exit 0
}

& $npx --yes eas-cli@latest submit --platform ios --profile production --latest
exit $LASTEXITCODE
