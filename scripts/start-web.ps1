param(
  [switch]$NoBrowser
)

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

function Open-MobilePreview($Url) {
  $browserPaths = @(
    (Join-Path ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe"),
    (Join-Path $env:ProgramFiles "Microsoft\Edge\Application\msedge.exe"),
    (Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe"),
    (Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe")
  )

  foreach ($browserPath in $browserPaths) {
    if (Test-Path -LiteralPath $browserPath) {
      Start-Process -FilePath $browserPath -ArgumentList @(
        "--app=$Url",
        "--window-size=430,932",
        "--window-position=40,40"
      )
      return
    }
  }

  Start-Process $Url
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$nodeRoot = "C:\Program Files\nodejs"
$npx = Join-Path $nodeRoot "npx.cmd"
$runScript = Join-Path $PSScriptRoot "run-expo-web.ps1"
$webLog = Join-Path $projectRoot "web.log"
$webErrLog = Join-Path $projectRoot "web.err.log"
$port = 8082
$url = "http://localhost:$port"

if (!(Test-Path -LiteralPath $npx)) {
  throw "npx bulunamadı: $npx"
}

$env:Path = "$nodeRoot;$env:Path"
Set-Location $projectRoot

Stop-PortProcess $port
Remove-Item -LiteralPath $webLog, $webErrLog -Force -ErrorAction SilentlyContinue

Write-Host "Zikr Defteri web önizleme hazırlanıyor..."
Start-Process -FilePath "powershell.exe" -ArgumentList @(
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
  "-File",
  $runScript
) -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput $webLog -RedirectStandardError $webErrLog | Out-Null

for ($i = 0; $i -lt 60; $i++) {
  Start-Sleep -Seconds 1

  try {
    $response = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      Write-Host "Hazır: $url"
      Write-Host "Log dosyası: $webLog"

      if (!$NoBrowser) {
        Open-MobilePreview $url
      }

      exit 0
    }
  } catch {
    if ($i % 10 -eq 9) {
      Write-Host "Web önizleme bekleniyor..."
    }
  }
}

Write-Host "Web önizleme açılamadı."
Write-Host "Log dosyası: $webLog"
Write-Host "Hata dosyası: $webErrLog"
exit 1
