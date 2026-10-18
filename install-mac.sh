#!/bin/bash
# Installs MS Gradients via Adobe's own plugin installer (UPIA),
# so Creative Cloud knows the plugin and doesn't drop it from the list again.
# Restart Photoshop afterwards: Plugins > MS Gradients.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
UPIA="/Library/Application Support/Adobe/Adobe Desktop Common/RemoteComponents/UPI/UnifiedPluginInstallerAgent/UnifiedPluginInstallerAgent.app/Contents/MacOS/UnifiedPluginInstallerAgent"

rm -f "$HERE/dist/MS-Gradients.ccx"
mkdir -p "$HERE/dist"
(cd "$HERE/gradients" && zip -qr "$HERE/dist/MS-Gradients.ccx" . -x '.*')

# only remove if already installed (otherwise the installer hangs)
if "$UPIA" --list all 2>/dev/null | grep -q "MS Gradients"; then
  "$UPIA" --remove "MS Gradients" >/dev/null 2>&1 || true
fi
"$UPIA" --install "$HERE/dist/MS-Gradients.ccx"
echo "Done. Restart Photoshop > Plugins > MS Gradients"
