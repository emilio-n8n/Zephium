import { getCurrentWindow } from "@tauri-apps/api/window";
import { mount } from "svelte";
import App from "$app/onboarding/OnboardingApp.svelte";

function showFailure(error: unknown) {
  const text = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
  console.error("trusted onboarding initialization failed", error);
  if (document.getElementById("onboarding-failure")) return;
  const banner = document.createElement("pre");
  banner.id = "onboarding-failure";
  banner.style.cssText =
    "position:fixed;inset-block-start:0;inset-inline:0;z-index:2147483647;margin:0;padding:12px;background:#54151a;color:#fff;font:12px/1.4 monospace;white-space:pre-wrap;max-block-size:45vh;overflow:auto";
  banner.textContent = `Zephium could not start onboarding:\n${text}`;
  document.body.append(banner);
}

window.addEventListener("error", (event) => showFailure(event.error ?? event.message));
window.addEventListener("unhandledrejection", (event) => showFailure(event.reason));

// A first run opens this page in the main window instead of the browser;
// native replaces it with the browser once it is finished.
try {
  if (getCurrentWindow().label !== "main") throw new Error("unexpected native surface");
  const target = document.getElementById("root");
  if (!(target instanceof HTMLElement)) throw new Error("trusted UI root is unavailable");
  mount(App, { target });
} catch (error) {
  showFailure(error);
}
