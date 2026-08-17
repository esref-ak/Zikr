$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$publicDir = Join-Path $projectRoot "public"
$distDir = Join-Path $projectRoot "dist"
$requiredFiles = @(
  "manifest.json",
  "sw.js",
  "icon-192.png",
  "icon-512.png",
  "app-icon.png",
  "apple-touch-icon.png"
)

if (!(Test-Path -LiteralPath $distDir)) {
  throw "dist klasoru bulunamadi. Once web derlemesi calismali."
}

foreach ($fileName in $requiredFiles) {
  $source = Join-Path $publicDir $fileName
  $destination = Join-Path $distDir $fileName

  if (!(Test-Path -LiteralPath $source)) {
    throw "PWA dosyasi eksik: $source"
  }

  Copy-Item -LiteralPath $source -Destination $destination -Force
}

Write-Host "PWA dosyalari dist klasorune kopyalandi."
