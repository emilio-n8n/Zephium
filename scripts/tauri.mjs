#!/usr/bin/env node
// Runs the Tauri CLI. On Linux the Work product and macOS page-permission
// features are not available, so the Linux build selects no default features;
// Browse, the blocker and the Linux native surface build from the same tree.
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
if (process.platform === "linux") {
  args.push("--no-default-features");
}

const result = spawnSync(
  process.platform === "win32" ? "tauri.cmd" : "tauri",
  args,
  { stdio: "inherit", shell: process.platform === "win32" },
);

if (result.error) {
  console.error(`could not run the Tauri CLI: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
