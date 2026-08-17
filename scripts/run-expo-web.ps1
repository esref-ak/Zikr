$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$nodeRoot = "C:\Program Files\nodejs"
$npx = Join-Path $nodeRoot "npx.cmd"

if (!(Test-Path -LiteralPath $npx)) {
  throw "npx bulunamadı: $npx"
}

$env:Path = "$nodeRoot;$env:Path"
Set-Location $projectRoot

& $npx expo start --web --port 8082
exit $LASTEXITCODE
