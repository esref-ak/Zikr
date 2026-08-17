@echo off
chcp 65001 >nul
title Zikr Defteri - Mobil Web Onizleme
cd /d "%~dp0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start-web.ps1"
if errorlevel 1 (
  echo.
  echo Baslatma sirasinda hata olustu. web.log ve web.err.log dosyalarini kontrol edin.
  pause
)
