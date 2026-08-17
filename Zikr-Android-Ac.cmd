@echo off
chcp 65001 >nul
title Zikr Defteri - Android
cd /d "%~dp0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start-android.ps1"
if errorlevel 1 (
  echo.
  echo Baslatma sirasinda hata olustu. debug.log, expo.err.log ve emulator.err.log dosyalarini kontrol edin.
  pause
)
