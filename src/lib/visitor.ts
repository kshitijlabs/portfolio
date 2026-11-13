// The visitor's name for the hero greeting ("Hello Priya, meet Kshitij.").
// The inline <head> script seeds it from ?to=Name or sessionStorage before
// first paint; the greeting itself can change it later.

export const VISITOR_EVENT = "visitor:change";
export const GREET_EDIT_EVENT = "greet:edit";

/** Same rule as the <head> script: letters, spaces, . ' - only, max 24. */
const NAME_RE = /^[\p{L}\p{M}' .-]{1,24}$/u;

export const normalizeName = (s: string) => s.trim().replace(/\s+/g, " ");
export const isValidName = (s: string) => NAME_RE.test(s);

export const getVisitor = () => document.documentElement.dataset.visitor ?? null;

export function subscribeVisitor(callback: () => void) {
  window.addEventListener(VISITOR_EVENT, callback);
  return () => window.removeEventListener(VISITOR_EVENT, callback);
}

export function setVisitor(name: string | null) {
  const root = document.documentElement;
  if (name) root.dataset.visitor = name;
  else delete root.dataset.visitor;
  try {
    if (name) sessionStorage.setItem("visitor", name);
    else sessionStorage.removeItem("visitor");
  } catch {
    /* storage blocked: the name still applies to this page view */
  }
  window.dispatchEvent(new CustomEvent<string | null>(VISITOR_EVENT, { detail: name }));
}

/** Opens the greeting's name field (used by the command menu). */
export function editGreeting() {
  window.dispatchEvent(new Event(GREET_EDIT_EVENT));
}
