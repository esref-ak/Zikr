@echo off
chcp 65001 >nul
title Zikr Defteri - Arkadasa QR Gonder
cd /d "%~dp0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File ".\scripts\share-iphone.ps1"
if errorlevel 1 (
  echo.
  echo Baslatma sirasinda hata olustu. Terminalde yazan mesaji kontrol edin.
  pause
)
