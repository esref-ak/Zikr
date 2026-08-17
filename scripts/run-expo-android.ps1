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

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$userRoot = Get-ShortPath $env:USERPROFILE
$sdkRoot = Join-Path $userRoot "AppData\Local\Android\Sdk"
$nodeRoot = "C:\Program Files\nodejs"
$npm = Join-Path $nodeRoot "npm.cmd"

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:ANDROID_AVD_HOME = Join-Path $userRoot ".android\avd"
$env:Path = "$nodeRoot;$sdkRoot\platform-tools;$sdkRoot\emulator;$env:Path"

Set-Location $projectRoot
& $npm run android
