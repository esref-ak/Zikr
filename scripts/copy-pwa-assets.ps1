$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$publicDir = Join-Path $projectRoot "public"
$distDir = Join-Path $projectRoot "dist"
$packageJsonPath = Join-Path $projectRoot "package.json"
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

$packageJson = Get-Content -LiteralPath $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
$cacheVersion = "v$($packageJson.version)-$((Get-Date).ToUniversalTime().ToString("yyyyMMddHHmmss"))"

foreach ($fileName in $requiredFiles) {
  $source = Join-Path $publicDir $fileName
  $destination = Join-Path $distDir $fileName

  if (!(Test-Path -LiteralPath $source)) {
    throw "PWA dosyasi eksik: $source"
  }

  if ($fileName -eq "sw.js") {
    $swContent = Get-Content -LiteralPath $source -Raw -Encoding UTF8

    if (!$swContent.Contains("__PWA_CACHE_VERSION__")) {
      throw "sw.js icinde __PWA_CACHE_VERSION__ yer tutucusu bulunamadi."
    }

    $swContent = $swContent.Replace("__PWA_CACHE_VERSION__", $cacheVersion)
    [System.IO.File]::WriteAllText($destination, $swContent, [System.Text.UTF8Encoding]::new($false))
  } else {
    Copy-Item -LiteralPath $source -Destination $destination -Force
  }
}

Write-Host "PWA dosyalari dist klasorune kopyalandi. Cache surumu: $cacheVersion"
