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
Write-Host "Arkadasina gondermek icin en kolay test akisi:"
Write-Host "1. Bu pencere acik kalacak."
Write-Host "2. Arkadasin iPhone'a Expo Go yukleyecek."
Write-Host "3. Asagida cikacak QR kodun ekran goruntusunu arkadasina gonder."
Write-Host "4. Arkadasin iPhone Kamera ile QR kodu okutacak."
Write-Host ""
Write-Host "Not: Tunnel modu uzaktan calisir ama LAN'a gore daha yavas olabilir."
Write-Host ""

Stop-PortProcess $port
& $npx expo start --tunnel --port $port
exit $LASTEXITCODE
