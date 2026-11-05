#!/bin/bash
set -euo pipefail
source_dir="$(cd "$(dirname "$0")" && pwd)"
project_dir="$(cd "$source_dir/../.." && pwd)"
build_dir="${1:-$project_dir/build/macos}"
mkdir -p "$build_dir"
build_dir="$(cd "$build_dir" && pwd)"
app_dir="$build_dir/Farmers Dream.app"
mkdir -p "$app_dir/Contents/MacOS" "$app_dir/Contents/Resources/Web" "$build_dir/module-cache"
sdk_path="${FD_MACOS_SDK:-$(xcrun --sdk macosx15.4 --show-sdk-path 2>/dev/null || xcrun --show-sdk-path)}"
xcrun clang -isysroot "$sdk_path" -arch arm64 -mmacosx-version-min=13.0 -fobjc-arc -fmodules -O2 \
  -fmodules-cache-path="$build_dir/module-cache" \
  -framework AppKit -framework WebKit -framework UniformTypeIdentifiers \
  "$source_dir/FarmersDream.m" -o "$app_dir/Contents/MacOS/FarmersDream"
cp "$source_dir/Info.plist" "$app_dir/Contents/Info.plist"
# Replace bundled resources with the exact current shared interface.
python3 - "$project_dir/dist" "$app_dir/Contents/Resources/Web" <<'PY'
from pathlib import Path
import shutil
import sys
source, target = map(Path, sys.argv[1:])
for file in target.iterdir():
    if file.is_dir():
        shutil.rmtree(file)
    else:
        file.unlink()
shutil.copytree(source, target, dirs_exist_ok=True)
PY
# Remove only Finder display metadata from this newly built bundle before signing.
xattr -d com.apple.FinderInfo "$app_dir" 2>/dev/null || true
codesign --force --deep --sign - "$app_dir"
plutil -lint "$app_dir/Contents/Info.plist"
printf 'Built: %s\n' "$app_dir"
