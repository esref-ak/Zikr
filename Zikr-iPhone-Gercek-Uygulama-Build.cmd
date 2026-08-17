@echo off
chcp 65001 >nul
title Zikr Defteri - Gercek iPhone Uygulamasi
cd /d "%~dp0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File ".\scripts\build-iphone-native.ps1"
if errorlevel 1 (
  echo.
  echo Build sirasinda hata olustu. Terminalde yazan mesaji kontrol edin.
  pause
)
