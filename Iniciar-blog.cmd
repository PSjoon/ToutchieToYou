@echo off
setlocal
cd /d "%~dp0"
title ToutchieToYou - servidor local
echo.
echo ToutchieToYou - mantenha esta janela aberta.
echo Quando aparecer Local, abra http://127.0.0.1:4173
echo.
where node >nul 2>nul
if not errorlevel 1 (
  node server.mjs
) else (
  if exist "C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt\dependencies\node\bin\node.exe" (
    "C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt\dependencies\node\bin\node.exe" server.mjs
  ) else (
    echo Node.js nao encontrado. Instale Node.js LTS de https://nodejs.org
  )
)
echo.
echo O servidor foi encerrado ou nao conseguiu iniciar. Confira a mensagem acima.
pause
