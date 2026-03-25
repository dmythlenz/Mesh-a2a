#!/bin/bash
echo "[1/4] Starting SEO Agent..."
python3 Agents/seo_agent.py &

echo "[2/4] Starting Ghost Input..."
python3 Agents/ghost_input.py &

echo "[3/4] Starting Sandbox Guardian..."
python3 Agents/sandbox_guardian.py &

sleep 2
echo "[4/4] Running Health Check..."
python3 Agents/diagnostic_agent.py

echo "Mesh Active. Launching Portal..."
xdg-open "UI/index.html" # Use 'open' for macOS
