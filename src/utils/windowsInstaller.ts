/**
 * Utilities for downloading Windows Desktop Application launchers and shortcuts.
 */

export function downloadWindowsBatchInstaller(appUrl: string) {
  const targetUrl = appUrl || window.location.href;

  const scriptContent = `@echo off
chcp 65001 >nul
title Instalador de SuperLista para Windows
color 0A
cls
echo ====================================================================
echo                 INSTALADOR DE SUPERLISTA PARA WINDOWS
echo ====================================================================
echo.
echo Creando acceso directo de aplicacion en tu Escritorio de Windows...
echo.

set "APP_URL=${targetUrl}"
set "SHORTCUT_NAME=SuperLista - Supermercado.lnk"
set "DESKTOP_PATH=%USERPROFILE%\\Desktop"

:: Usamos PowerShell para crear el acceso directo nativo (.lnk) en modo ventana de aplicacion
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$shortcut = $ws.CreateShortcut([System.IO.Path]::Combine($env:USERPROFILE, 'Desktop', 'SuperLista - Supermercado.lnk')); " ^
  "$edgePath = [System.IO.Path]::Combine($env:ProgramFiles(x86), 'Microsoft', 'Edge', 'Application', 'msedge.exe'); " ^
  "if (!(Test-Path $edgePath)) { $edgePath = [System.IO.Path]::Combine($env:ProgramFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'); }; " ^
  "if (Test-Path $edgePath) { " ^
  "    $shortcut.TargetPath = $edgePath; " ^
  "    $shortcut.Arguments = '--app=\"${targetUrl}\"'; " ^
  "} else { " ^
  "    $shortcut.TargetPath = '${targetUrl}'; " ^
  "}; " ^
  "$shortcut.Description = 'SuperLista - Lista de Compras de Supermercado con Precios 2026'; " ^
  "$shortcut.WindowStyle = 1; " ^
  "$shortcut.Save()"

if exist "%DESKTOP_PATH%\\%SHORTCUT_NAME%" (
    echo.
    echo ====================================================================
    echo   [LISTO] ¡SuperLista se ha instalado en tu Escritorio!
    echo ====================================================================
    echo.
    echo Encontraras el icono 'SuperLista - Supermercado' en tu pantalla.
    echo Al hacer doble clic, abrira como una aplicacion nativa de Windows
    echo sin barras de navegacion, con guardado automatico en tu PC.
    echo.
) else (
    echo Creando acceso directo rapido...
    (
        echo [InternetShortcut]
        echo URL=${targetUrl}
        echo IconIndex=0
    ) > "%DESKTOP_PATH%\\SuperLista - Supermercado.url"
    echo.
    echo [LISTO] Se ha creado el acceso directo en tu Escritorio.
    echo.
)

echo Presiona cualquier tecla para salir...
pause >nul
`;

  const blob = new Blob([scriptContent], { type: 'application/bat;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Instalar_SuperLista_Windows.bat';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadWindowsVbsLauncher(appUrl: string) {
  const targetUrl = appUrl || window.location.href;

  const content = `' SuperLista - Lanzador de Escritorio para Windows
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "msedge.exe --app=""" & "${targetUrl}" & """", 1, False
`;

  const blob = new Blob([content], { type: 'text/vbscript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SuperLista_App.vbs';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadWindowsUrlShortcut(appUrl: string) {
  const targetUrl = appUrl || window.location.href;

  const content = `[InternetShortcut]
URL=${targetUrl}
IconIndex=0
`;

  const blob = new Blob([content], { type: 'application/internet-shortcut;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SuperLista - Supermercado.url';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
