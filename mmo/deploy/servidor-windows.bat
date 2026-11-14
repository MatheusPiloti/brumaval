@echo off
chcp 65001 >nul
title Brumaval Online - servidor
rem Liga o servidor do Brumaval Online neste computador e cria um link publico (https) gratis pela Cloudflare.
rem Deixe esta janela aberta enquanto estiverem jogando. Fechar = servidor desligado.

cd /d "%~dp0..\server"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Falta o Node.js. Baixe a versao LTS em https://nodejs.org , instale e abra este arquivo de novo.
  start https://nodejs.org
  pause
  exit /b
)

if not exist node_modules (
  echo Instalando o servidor pela primeira vez...
  call npm install --omit=dev --no-audit --no-fund
)

if not exist cloudflared.exe (
  echo Baixando o cloudflared, que cria o link publico...
  curl -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
)

echo Ligando o servidor do jogo...
start "Brumaval - jogo (nao feche)" cmd /k "set HOST=127.0.0.1&& set PORT=8080&& node server.js"
timeout /t 4 >nul

echo.
echo ==================================================================
echo  Em alguns segundos aparece abaixo um endereco assim:
echo     https://alguma-coisa.trycloudflare.com
echo  Esse e o link do jogo. Mande para quem vai jogar.
echo  Neste computador voce tambem pode abrir: http://localhost:8080
echo  A primeira conta criada no jogo vira ADM.
echo ==================================================================
echo.
cloudflared.exe tunnel --url http://localhost:8080
pause
