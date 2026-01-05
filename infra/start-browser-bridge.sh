#!/bin/bash

# WSL2 Browser Bridge Automator
# This script launches Windows Chrome with remote debugging and sets up a port bridge
# so that WSL2 tools (like Playwright/AI Agents) can control it.

# 1. Configuration
HOST_IP=$(ip route show | grep default | awk '{print $3}')
PROXY_PORT=9223
WSL_PORT=9222
CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
CHROME_PROFILE="C:\temp\chrome-profile"
PROXY_SCRIPT="C:\temp\proxy.py"

echo "🚀 Starting WSL2 Browser Bridge..."
echo "📍 Host IP detected: $HOST_IP"

# 2. Kill only existing Proxy processes on Windows (to free up port 9223)
echo "🧹 Cleaning up existing bridge processes..."
powershell.exe -Command "Get-Process python | Where-Object { \$_.CommandLine -like '*proxy.py*' } | Stop-Process -Force -ErrorAction SilentlyContinue"

# 3. Launch Chrome on Windows
echo "🌐 Launching Windows Chrome with debugging on 9222..."
powershell.exe -Command "Start-Process -FilePath '$CHROME_PATH' -ArgumentList '--remote-debugging-port=9222','--user-data-dir=$CHROME_PROFILE' -WindowStyle Minimized"

# 4. Launch the Python Proxy on Windows
echo "⚓ Starting Windows Proxy Bridge (9223 -> 9222)..."
powershell.exe -Command "Start-Process -FilePath 'python.exe' -ArgumentList '$PROXY_SCRIPT' -WindowStyle Hidden"

# 5. Setup the WSL2 Port Proxy (socat)
echo "🔗 Bridging WSL2 port $WSL_PORT to Host port $PROXY_PORT..."
# Kill any existing socat bridge
pkill -f "socat TCP-LISTEN:$WSL_PORT"
# Start new bridge in background
nohup socat TCP-LISTEN:$WSL_PORT,fork,reuseaddr TCP:$HOST_IP:$PROXY_PORT > /dev/null 2>&1 &

# 6. Verify Connectivity
echo "⏳ Waiting for bridge to stabilize..."
sleep 3
if nc -zv localhost $WSL_PORT > /dev/null 2>&1; then
    echo "✅ SUCCESS! Browser bridge is active."
    echo "🔗 You can now use 'localhost:$WSL_PORT' in your AI tools."
    curl -s http://localhost:$WSL_PORT/json/version | grep -E "Browser|User-Agent"
else
    echo "❌ ERROR: Could not reach the bridge. Please check your Windows Firewall."
fi
