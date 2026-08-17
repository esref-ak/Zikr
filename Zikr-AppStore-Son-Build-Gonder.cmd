@echo off
chcp 65001 >nul
title Zikr Defteri - Son iOS Build'i Gonder
cd /d "%~dp0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File ".\scripts\appstore-submit-latest.ps1"
if errorlevel 1 (
  echo.
  echo Submit sirasinda hata olustu. Terminalde yazan mesaji kontrol edin.
  pause
)
