$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

function Get-ShortPath($Path) {
  $escaped = $Path.Replace('"', '""')
  $shortPath = cmd /c "for %I in (`"$escaped`") do @echo %~sI"

  if ([string]::IsNullOrWhiteSpace($shortPath)) {
    return $Path
  }

  return $shortPath.Trim()
}

function Stop-PortProcess($Port) {
  $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
  $processIds = $connections |
    Where-Object { $_.OwningProcess -and $_.OwningProcess -ne $PID } |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($processId in $processIds) {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
  }
}

function Set-AvdConfig($AvdDir, $SdkRoot) {
  if (!(Test-Path -LiteralPath $AvdDir)) {
    throw "Pixel_7 AVD bulunamadı. Android Studio Device Manager içinde Pixel 7 oluştur."
  }

  $configPath = Join-Path $AvdDir "config.ini"
  $config = Get-Content -LiteralPath $configPath -Raw
  $settings = @{
    "fastboot.forceColdBoot" = "yes"
    "fastboot.forceFastBoot" = "no"
    "hw.camera.back" = "none"
    "hw.camera.front" = "none"
    "hw.cpu.ncore" = "2"
    "hw.gpu.mode" = "swiftshader_indirect"
    "hw.lcd.density" = "320"
    "hw.lcd.height" = "1280"
    "hw.lcd.width" = "720"
    "hw.ramSize" = "1536"
    "showDeviceFrame" = "no"
    "skin.path" = "$SdkRoot\skins\pixel_7"
  }

  foreach ($key in $settings.Keys) {
    $escapedKey = [regex]::Escape($key)
    if ($config -match "(?m)^$escapedKey=") {
      $config = $config -replace "(?m)^$escapedKey=.*", "$key=$($settings[$key])"
    } else {
      $config += "`n$key=$($settings[$key])"
    }
  }

  Set-Content -LiteralPath $configPath -Encoding UTF8 -Value $config
}

function Stop-Emulator() {
  Stop-Process -Name adb -Force -ErrorAction SilentlyContinue
  Stop-Process -Name emulator,qemu-system-x86_64 -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 2
}

function Remove-AvdLocks($AvdDir) {
  $lockPaths = @(
    (Join-Path $AvdDir "hardware-qemu.ini.lock")
    (Join-Path $AvdDir "multiinstance.lock")
    (Join-Path $AvdDir "snapshot.lock.lock")
  )

  foreach ($lockPath in $lockPaths) {
    if (Test-Path -LiteralPath $lockPath) {
      Remove-Item -LiteralPath $lockPath -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
}

function Get-ReadyEmulatorSerial($Adb) {
  $devices = & $Adb devices -l

  foreach ($line in $devices) {
    if ($line -match "^(emulator-\d+)\s+device\b") {
      return $matches[1]
    }
  }

  return $null
}

function Test-BootCompleted($Adb) {
  $serial = Get-ReadyEmulatorSerial $Adb

  if (!$serial) {
    return $false
  }

  $bootState = & $Adb -s $serial shell getprop sys.boot_completed 2>$null
  return $bootState -match "1"
}

function Wait-ForBoot($Adb, $Seconds) {
  $attempts = [Math]::Max([Math]::Floor($Seconds / 5), 1)

  for ($i = 0; $i -lt $attempts; $i++) {
    if (Test-BootCompleted $Adb) {
      return $true
    }

    if ($i % 6 -eq 0) {
      Write-Host "Emülatör bekleniyor..."
      & $Adb devices -l
    }

    Start-Sleep -Seconds 5
  }

  return $false
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$realUserRoot = $env:USERPROFILE
$userRoot = Get-ShortPath $realUserRoot
$sdkRoot = Join-Path $userRoot "AppData\Local\Android\Sdk"
$avdHome = Join-Path $userRoot ".android\avd"
$realAvdHome = Join-Path $realUserRoot ".android\avd"
$adb = Join-Path $sdkRoot "platform-tools\adb.exe"
$emulator = Join-Path $sdkRoot "emulator\emulator.exe"
$nodeRoot = "C:\Program Files\nodejs"
$npm = Join-Path $nodeRoot "npm.cmd"
$avdName = "Pixel_7"
$avdDir = Join-Path $avdHome "$avdName.avd"
$realAvdDir = Join-Path $realAvdHome "$avdName.avd"
$debugLog = Join-Path $projectRoot "debug.log"
$errorLog = Join-Path $projectRoot "expo.err.log"
$emulatorLog = Join-Path $projectRoot "emulator.log"
$emulatorErrLog = Join-Path $projectRoot "emulator.err.log"
$runExpoScript = Join-Path $PSScriptRoot "run-expo-android.ps1"

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:ANDROID_AVD_HOME = $avdHome
$env:Path = "$nodeRoot;$sdkRoot\platform-tools;$sdkRoot\emulator;$env:Path"

if (!(Test-Path -LiteralPath $adb)) {
  throw "ADB bulunamadı: $adb"
}

if (!(Test-Path -LiteralPath $emulator)) {
  throw "Android Emulator bulunamadı: $emulator"
}

if (!(Test-Path -LiteralPath $npm)) {
  throw "npm bulunamadı: $npm"
}

Set-Content -LiteralPath (Join-Path $realAvdHome "$avdName.ini") -Encoding UTF8 -Value @(
  "avd.ini.encoding=UTF-8",
  "path=$avdDir",
  "path.rel=avd\$avdName.avd",
  "target=android-36"
)

Set-AvdConfig $realAvdDir $sdkRoot

Write-Host "Eski Metro ve takılı emülatör süreçleri temizleniyor..."
Stop-PortProcess 8081
Stop-Emulator
& $adb kill-server | Out-Null
Remove-AvdLocks $realAvdDir

Remove-Item -LiteralPath $emulatorLog, $emulatorErrLog -Force -ErrorAction SilentlyContinue

Write-Host "Pixel 7 emülatörü açılıyor..."
Start-Process -FilePath $emulator -ArgumentList @(
  "-avd", $avdName,
  "-port", "5554",
  "-no-snapshot",
  "-gpu", "swiftshader_indirect",
  "-no-boot-anim",
  "-no-audio",
  "-no-metrics"
) -RedirectStandardOutput $emulatorLog -RedirectStandardError $emulatorErrLog | Out-Null

& $adb start-server | Out-Null

if (!(Wait-ForBoot $adb 180)) {
  Write-Host "İlk açılış takıldı, Pixel 7 temiz veriyle yeniden deneniyor..."
  Stop-Emulator
  Remove-AvdLocks $realAvdDir
  Remove-Item -LiteralPath $emulatorLog, $emulatorErrLog -Force -ErrorAction SilentlyContinue

  Start-Process -FilePath $emulator -ArgumentList @(
    "-avd", $avdName,
    "-wipe-data",
    "-port", "5554",
    "-no-snapshot",
    "-gpu", "swiftshader_indirect",
    "-no-boot-anim",
    "-no-audio",
    "-no-metrics"
  ) -RedirectStandardOutput $emulatorLog -RedirectStandardError $emulatorErrLog | Out-Null

  & $adb start-server | Out-Null

  if (!(Wait-ForBoot $adb 240)) {
    & $adb devices -l
    throw "Emülatör açıldı ama Android sistemi hazır hale gelmedi. Ayrıntı için emulator.err.log dosyasına bak."
  }
}

Remove-Item -LiteralPath $debugLog, $errorLog -Force -ErrorAction SilentlyContinue

Write-Host "Expo arka planda başlatılıyor ve uygulama emülatöre gönderiliyor..."
Start-Process -FilePath "powershell.exe" -ArgumentList @(
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
  "-File",
  $runExpoScript
) -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput $debugLog -RedirectStandardError $errorLog | Out-Null

for ($i = 0; $i -lt 24; $i++) {
  Start-Sleep -Seconds 5

  if (Test-Path -LiteralPath $debugLog) {
    $log = Get-Content -LiteralPath $debugLog -Raw -ErrorAction SilentlyContinue
    if ($log -match "Waiting on http://localhost:8081" -or $log -match "Opening exp://") {
      Write-Host "Hazır. Emülatörde Zikr Defteri açılıyor."
      Write-Host "Log dosyası: $debugLog"
      exit 0
    }
  }
}

Write-Host "Expo başlatıldı; emülatör penceresini ve debug.log dosyasını kontrol et."
Write-Host "Log dosyası: $debugLog"
