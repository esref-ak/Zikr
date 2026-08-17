$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

function Stop-PortProcess($Port) {
  $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
  $processIds = $connections |
    Where-Object { $_.OwningProcess -and $_.OwningProcess -ne $PID } |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($processId in $processIds) {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
  }
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$nodeRoot = "C:\Program Files\nodejs"
$npx = Join-Path $nodeRoot "npx.cmd"
$port = 8081

if (!(Test-Path -LiteralPath $npx)) {
  throw "npx bulunamadı: $npx"
}

$env:Path = "$nodeRoot;$env:Path"
Set-Location $projectRoot

Write-Host ""
Write-Host "iPhone'da denemek icin:"
Write-Host "1. iPhone'a App Store'dan Expo Go yukle."
Write-Host "2. Asagida cikacak QR kodu iPhone Kamera uygulamasi ile okut."
Write-Host "3. Bu pencere acik kaldigi surece uygulama telefonda calisir."
Write-Host ""
Write-Host "Not: iPhone ayni Wi-Fi'da olmasa bile tunnel modu denenecek."
Write-Host "Not: Tunnel modu LAN'a gore biraz daha yavas olabilir."
Write-Host ""

Stop-PortProcess $port
& $npx expo start --tunnel --port $port
exit $LASTEXITCODE
