@echo off
chcp 65001 >nul
title Zikr Defteri - App Store Yayinla
cd /d "%~dp0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File ".\scripts\appstore-build-submit.ps1"
if errorlevel 1 (
  echo.
  echo App Store build/submit sirasinda hata olustu. Terminalde yazan mesaji kontrol edin.
  pause
)
