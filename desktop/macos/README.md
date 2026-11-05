# Farmers Dream desktop for macOS

Native macOS window hosting the same `dist/` application through Apple's WKWebView. The app includes category pages, directories, registration forms, listing photos, role-based feeds, bidding and the English/Sinhala/Tamil selector.

## Build

Requires Apple Silicon, macOS 13 or newer, Python 3 and Apple's Command Line Tools.

```sh
bash desktop/macos/build.sh
```

The output is `build/macos/Farmers Dream.app`. Pass an absolute output directory as the first argument to change its location. The script prefers the macOS 15.4 SDK when installed, falling back to the selected SDK. Override with `FD_MACOS_SDK=/path/to/MacOSX.sdk` if necessary. It copies the exact current `dist/` files into the app and ad-hoc signs the local bundle. Rebuild whenever the shared interface changes.

## Use

Open Farmers Dream.app. The app has native Edit commands, Home/Reload/Back/Forward commands and image selection. Move or copy the whole bundle; keep its contents intact. The locally built app is not notarized or an App Store release. Do not bypass macOS security warnings; this build is intended for this Mac's local testing.

Data uses the app's persistent WKWebView store. Registrations, listings and bids are local to this app; browser data is separate and is not imported automatically. Profile verification, live shared bidding and the Cloudflare backend remain unimplemented. The app does not auto-update or deploy anything. Future updates require rebuilding/replacing the app, keeping its bundle identifier `lk.farmersdream.desktop` unchanged.
