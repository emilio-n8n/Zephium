# Zephium on Linux

This branch enables the Linux desktop build that upstream keeps in the tree
but does not ship. It is the same Rust shell, GTK composition and WebKitGTK
adapter, packaged as a native Linux application rather than a Chromium fork.

The Linux build currently targets **Browse**. Work (the agent canvas),
Chrome extensions, downloads and file uploads are not part of this first
port; the shared command surface returns their normal `Unavailable` answers
and the UI hides or refuses them.

## Requirements

- x86_64 Linux with GTK 3.24 and WebKitGTK 4.1 **2.54.0 or newer**.
  The runtime floor comes from
  [WSA-2026-0006](https://webkitgtk.org/security/WSA-2026-0006.html); the app
  refuses older engines before it creates a WebView. Arch users should run
  `sudo pacman -Syu` to move `webkit2gtk-4.1` past 2.52.
- GStreamer 1.0 with the usual `base`, `good`, `bad` and `libav` plugins for
  video and audio pages (host-provided).
- Wayland or X11. On Wayland the global launcher shortcut goes through the
  XDG GlobalShortcuts portal; on X11 it uses a direct, reply-checked grab.
  When neither is available, the focused-window shortcut keeps working.

## Install

### Debian and Ubuntu

```sh
sudo apt install ./Zephium-linux-x64.deb
zephium-desktop
```

The package depends on `libwebkit2gtk-4.1-0 (>= 2.54.0)`.

### Portable archive (Arch, Fedora, anything else)

```sh
mkdir -p ~/.local/opt/zephium
tar -C ~/.local/opt/zephium -xzf Zephium-linux-x64.tar.gz
~/.local/opt/zephium/usr/bin/zephium-desktop
```

The archive contains the binary, desktop entry, icons and licenses from the
Debian package, but no WebKitGTK — it uses the distribution's runtime.
To register it in the application menu, copy
`usr/share/applications/app.zephium.desktop` to
`~/.local/share/applications/` and point `Exec=` at the binary, or extract
the archive over `/` on a system where installing to `/usr` is fine.

The Linux desktop identity is `app.zephium` (Tauri product name, GTK
application id and desktop basename), while the visible name stays
**Zephium**.

## Build from source

```sh
git clone https://github.com/emilio-n8n/Zephium
cd Zephium
pnpm install --frozen-lockfile
pnpm build
```

On Linux `pnpm build` selects the Linux platform config, which builds the
Browse surface without the macOS/Windows Work composition. The installers are
written to `target/release/bundle/deb/`.

Build dependencies (Debian/Ubuntu):

```sh
sudo apt install build-essential curl file libgtk-3-dev \
  libjavascriptcoregtk-4.1-dev librsvg2-dev libsoup-3.0-dev libssl-dev \
  libwebkit2gtk-4.1-dev patchelf pkg-config wget
```

Fedora equivalents: `gtk3-devel webkit2gtk4.1-devel libsoup3-devel
javascriptcoregtk4.1-devel librsvg2-devel patchelf`. Arch:
`base-devel webkit2gtk-4.1 gtk3 libsoup3`.

Development uses the same platform split:

```sh
pnpm dev
```

The first run opens Browse directly on Linux. The GTK/WebKitGTK onboarding
scene is not yet validated on a hidden GTK surface, so the port records
onboarding as finished instead of presenting an empty ground. Debug builds
can still open it with `ZEPHIUM_ONBOARDING=1 pnpm dev`.

## Verification

The fork's [Linux workflow](../.github/workflows/linux.yml) builds on
`ubuntu-24.04`, runs `cargo check`, produces the `.deb`, and stages the
portable `.tar.gz`. The native-engineering and hostile-page matrices that
upstream requires for a shipped runtime are still outstanding; treat this as
a usable Browse port, not a security-certified release.

## What is not there yet

| Area | State |
| --- | --- |
| Browse, tabs, splits, Spaces, profiles, private windows | works |
| Native ad/tracker blocker | works (WebKit content filters) |
| History, bookmarks, find-in-page, page zoom | works |
| Work / agents / AI canvas | not compiled on Linux |
| Chrome extensions | unavailable (no WebKitGTK runtime adapter) |
| Downloads, file uploads, file pickers | denied fail-closed |
| Automatic updates | unavailable; install a new package manually |
| macOS/Windows qualification probes | not built |
