@echo off
SETLOCAL EnableDelayedExpansion
title Liquid Mesh - One Click Start

echo [Step 1] Checking Dependencies...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.10+ to use Liquid Mesh.
    pause
    exit
)

echo [Step 2] Auto-Installing High-Speed Libraries...
pip install -r requirements.txt --quiet

echo [Step 3] SEO Agent: Mapping your Local "Massive RAM"...
python Agents\seo_agent.py

echo [Step 4] Igniting Parallel Pipelines...
start /B python Agents\ghost_input.py
start /B python Agents\sandbox_guardian.py

echo [Step 5] Launching Zero-Lag Portal...
timeout /t 2 >nul
start chrome "%cd%\UI\index.html" --incognito --disable-gpu-vsync

echo.
echo ==========================================
echo LIQUID MESH IS LIVE
echo Hardware Pooled. Network Optimized.
echo ==========================================
pause
