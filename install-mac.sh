#!/bin/bash
# Installs Gradient Library via Adobe's own plugin installer (UPIA),
# so Creative Cloud knows the plugin and doesn't drop it from the list again.
# Restart Photoshop afterwards: Plugins > Gradient Library.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
UPIA="/Library/Application Support/Adobe/Adobe Desktop Common/RemoteComponents/UPI/UnifiedPluginInstallerAgent/UnifiedPluginInstallerAgent.app/Contents/MacOS/UnifiedPluginInstallerAgent"

rm -f "$HERE/dist/Gradient-Library.ccx"
mkdir -p "$HERE/dist"
(cd "$HERE/gradients" && zip -qr "$HERE/dist/Gradient-Library.ccx" . -x '.*')

# only remove if already installed (otherwise the installer hangs)
if "$UPIA" --list all 2>/dev/null | grep -q "Gradient Library"; then
  "$UPIA" --remove "Gradient Library" >/dev/null 2>&1 || true
fi
"$UPIA" --install "$HERE/dist/Gradient-Library.ccx"
echo "Done. Restart Photoshop > Plugins > Gradient Library"
