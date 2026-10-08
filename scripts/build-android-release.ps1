param(
    [Parameter(Mandatory = $true)][string]$BuildDirectory
)
$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
$buildDirectoryPath = [IO.Path]::GetFullPath($BuildDirectory)
if (-not (Test-Path -LiteralPath (Join-Path $buildDirectoryPath 'android/keystore.properties'))) {
    throw 'Use the existing Android build directory containing the upload signing configuration.'
}
$sourcePackage = Get-Content -Raw -LiteralPath (Join-Path $projectDirectory 'package.json') | ConvertFrom-Json
$buildPackage = Get-Content -Raw -LiteralPath (Join-Path $buildDirectoryPath 'package.json') | ConvertFrom-Json
if (($sourcePackage.dependencies | ConvertTo-Json -Compress) -ne ($buildPackage.dependencies | ConvertTo-Json -Compress)) {
    throw 'Build dependencies differ. Install the project lockfile in the build directory first.'
}
foreach ($folder in @('src', 'assets', 'plugins')) {
    & robocopy (Join-Path $projectDirectory $folder) (Join-Path $buildDirectoryPath $folder) /E /NFL /NDL /NJH /NJS
    if ($LASTEXITCODE -ge 8) { throw "Copy failed: $folder" }
}
foreach ($file in @('App.tsx', 'index.ts', 'app.json', 'package.json', 'package-lock.json', 'tsconfig.json')) {
    Copy-Item -LiteralPath (Join-Path $projectDirectory $file) -Destination (Join-Path $buildDirectoryPath $file) -Force
}
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'prepare-android-release.cjs') -Destination (Join-Path $buildDirectoryPath 'scripts/prepare-android-release.cjs') -Force
$env:JAVA_HOME = 'C:\Users\Public\jdks\temurin17\jdk-17.0.20.1+1'
$env:ANDROID_HOME = 'C:\Users\Public\AndroidSdk'
$env:GRADLE_USER_HOME = 'C:\Users\Public\gradle-zikr'
$env:TEMP = 'C:\Users\Public\TempZikr'
$env:TMP = $env:TEMP
$env:NODE_ENV = 'production'
Push-Location $buildDirectoryPath
try {
    & node scripts/prepare-android-release.cjs
    if ($LASTEXITCODE -ne 0) { throw 'Release configuration failed.' }
    Push-Location android
    try {
        $ErrorActionPreference = 'Continue'
        & .\gradlew.bat :app:bundleRelease :app:assembleRelease --console=plain --no-daemon *> (Join-Path $projectDirectory '.tmp/release-build.log')
        $buildExitCode = $LASTEXITCODE
        $ErrorActionPreference = 'Stop'
        if ($buildExitCode -ne 0) { throw 'Android release build failed. See .tmp/release-build.log.' }
    } finally { Pop-Location }
    $appConfig = (Get-Content -Raw app.json | ConvertFrom-Json).expo
    $releaseName = "Zikr-Defteri-$($appConfig.version)-$($appConfig.android.versionCode)"
    $outputDirectory = Join-Path $projectDirectory 'Play Store'
    Copy-Item -LiteralPath 'android/app/build/outputs/bundle/release/app-release.aab' -Destination (Join-Path $outputDirectory "$releaseName-release.aab") -Force
    Copy-Item -LiteralPath 'android/app/build/outputs/mapping/release/mapping.txt' -Destination (Join-Path $outputDirectory "$releaseName-mapping.txt") -Force
    Copy-Item -LiteralPath 'android/app/build/outputs/apk/release/app-release.apk' -Destination (Join-Path $projectDirectory "builds/$releaseName-test.apk") -Force
    Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $outputDirectory "$releaseName-release.aab")
} finally { Pop-Location }
