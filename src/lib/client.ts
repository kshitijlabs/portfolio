// Small browser-side helpers shared by client components.

declare global {
  interface Window {
    __bootDone?: boolean;
  }
}

export const BOOT_DONE_EVENT = "boot:done";
export const TOAST_EVENT = "toast";
export const CMDK_OPEN_EVENT = "cmdk:open";

/** True while the first-visit boot sequence is still covering the page. */
export function isBootPending() {
  return document.documentElement.classList.contains("booting") && !window.__bootDone;
}

export function markBootDone() {
  window.__bootDone = true;
  window.dispatchEvent(new Event(BOOT_DONE_EVENT));
}

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

export function openCommandMenu() {
  window.dispatchEvent(new Event(CMDK_OPEN_EVENT));
}

export function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* storage blocked: theme still switches for this page view */
  }
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(`Copied ${text}`);
  } catch {
    toast(`Couldn't copy. The address is ${text}`);
  }
}

// ---------- The pixel dinosaur (on unless the visitor sends it away) ----------
export const PET_EVENT = "pet:change";
let petFallback = true; // used when localStorage is blocked

export function isPetEnabled() {
  try {
    return localStorage.getItem("pet") !== "off";
  } catch {
    return petFallback;
  }
}

export function subscribePet(callback: () => void) {
  window.addEventListener(PET_EVENT, callback);
  return () => window.removeEventListener(PET_EVENT, callback);
}

export function togglePet() {
  const next = !isPetEnabled();
  petFallback = next;
  try {
    localStorage.setItem("pet", next ? "on" : "off");
  } catch {
    /* fall back to memory */
  }
  window.dispatchEvent(new Event(PET_EVENT));
  toast(next ? "Rawr. Dino is back." : "Dino went for a nap. ⌘K to wake it.");
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
