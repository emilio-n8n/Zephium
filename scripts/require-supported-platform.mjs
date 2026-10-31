// Zephium builds on macOS, Windows and Linux. Other targets are rejected
// before Cargo with a clear note.
if (!["darwin", "win32", "linux"].includes(process.platform)) {
  console.error(
    `Zephium isn't available on ${process.platform} yet. We're working on it; follow https://zephium.app for news.`,
  );
  process.exit(1);
}
