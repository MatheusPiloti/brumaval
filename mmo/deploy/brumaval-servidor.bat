@echo off
chcp 65001 >nul
title Brumaval Online - instalador
rem Um clique: instala o Node.js (se faltar), baixa o jogo e liga o servidor com link publico.
set "DEST=%USERPROFILE%\BrumavalServidor"

where node >nul 2>nul
if errorlevel 1 (
  echo Instalando o Node.js. Se o Windows pedir permissao, clique em Sim.
  winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
  set "PATH=%PATH%;%ProgramFiles%\nodejs"
)
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Nao consegui instalar o Node.js sozinho. Instale a versao LTS no site que vai abrir e depois abra este arquivo de novo.
  start https://nodejs.org
  pause
  exit /b
)

echo Baixando a versao mais nova do jogo...
if not exist "%DEST%" mkdir "%DEST%"
curl -L -o "%DEST%\brumaval.zip" https://github.com/matheuspiloti/brumaval/archive/refs/heads/main.zip
tar -xf "%DEST%\brumaval.zip" -C "%DEST%"
del "%DEST%\brumaval.zip"

call "%DEST%\brumaval-main\mmo\deploy\servidor-windows.bat"
