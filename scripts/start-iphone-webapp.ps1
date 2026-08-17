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

function Get-LanUrls($Port) {
  $urls = @(Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object {
      $_.IPAddress -notmatch '^127\.' -and
      $_.IPAddress -notmatch '^169\.254\.' -and
      $_.IPAddress -notmatch '^0\.'
    } |
    Sort-Object InterfaceMetric |
    Select-Object -ExpandProperty IPAddress -Unique |
    ForEach-Object { "http://$_`:$Port" })

  if ($urls.Count -gt 0) {
    return $urls
  }

  ipconfig |
    Select-String -Pattern 'IPv4' |
    ForEach-Object {
      [regex]::Matches($_.Line, '(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])') |
        ForEach-Object { $_.Value }
    } |
    Where-Object {
      $_ -notmatch '^127\.' -and
      $_ -notmatch '^169\.254\.' -and
      $_ -notmatch '^0\.'
    } |
    Select-Object -Unique |
    ForEach-Object { "http://$_`:$Port" }
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$nodeRoot = "C:\Program Files\nodejs"
$npx = Join-Path $nodeRoot "npx.cmd"
$runScript = Join-Path $PSScriptRoot "run-expo-web.ps1"
$webLog = Join-Path $projectRoot "web.log"
$webErrLog = Join-Path $projectRoot "web.err.log"
$port = 8082
$localUrl = "http://localhost:$port"

if (!(Test-Path -LiteralPath $npx)) {
  throw "npx bulunamadi: $npx"
}

$env:Path = "$nodeRoot;$env:Path"
Set-Location $projectRoot

Write-Host ""
Write-Host "Uyari: Bu mod, telefonu baglamak icin uygulamayi yerel ag IP adresinden acar."
Write-Host "Sirket, okul, kafe veya ortak Wi-Fi aglarinda ayni agdaki bazi cihazlar bu adrese erisebilir."
Write-Host "Devam etmeden once guvendigin ozel bir agda oldugundan emin ol."
$confirmation = Read-Host "Devam etmek istiyor musun? Evet yaz"
if ($confirmation -ne "Evet") {
  Write-Host "Iptal edildi. Yerel ag sunucusu baslatilmadi."
  exit 0
}

Stop-PortProcess $port
Remove-Item -LiteralPath $webLog, $webErrLog -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Zikr Defteri iPhone web uygulamasi hazirlaniyor..."

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
    $response = Invoke-WebRequest -UseBasicParsing $localUrl -TimeoutSec 2
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      $lanUrls = @(Get-LanUrls $port)

      Write-Host ""
      Write-Host "Hazir. iPhone'a uygulama gibi eklemek icin:"
      Write-Host "1. iPhone ve bilgisayar ayni Wi-Fi aginda olsun."
      Write-Host "2. iPhone Safari'de su adreslerden birini ac:"

      if ($lanUrls.Count -gt 0) {
        foreach ($url in $lanUrls) {
          Write-Host "   $url"
        }
      } else {
        Write-Host "   Bu bilgisayarin yerel IP adresini bulup http://IP:$port seklinde ac."
      }

      Write-Host "3. Safari'de Paylas > Ana Ekrana Ekle sec."
      Write-Host "4. Varsa 'Open as Web App' acik kalsin, sonra Ekle'ye bas."
      Write-Host ""
      Write-Host "Not: Bu yerel adres bilgisayar ve web sunucusu acikken calisir."
      Write-Host "Kalici kurulum icin 'npm run build:web' ile cikan dist klasorunu HTTPS bir adrese yayinla."
      Write-Host ""
      Read-Host "Bu bilgiyi aldiktan sonra pencereyi kapatmak icin Enter"
      exit 0
    }
  } catch {
    if ($i % 10 -eq 9) {
      Write-Host "Web uygulamasi bekleniyor..."
    }
  }
}

Write-Host "Web uygulamasi acilamadi."
Write-Host "Log dosyasi: $webLog"
Write-Host "Hata dosyasi: $webErrLog"
exit 1
