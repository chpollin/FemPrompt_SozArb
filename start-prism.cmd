@echo off
rem Double-click to start PRISM for reviewing. Keeps the window open on an error.
cd /d "%~dp0"
python -X utf8 -m src.publish.start_prism
if errorlevel 1 pause
