@echo off
cd /d "%~dp0"
git add .
git commit -m "Auto commit at %date% %time%"
git push origin main
