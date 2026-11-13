"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "@/lib/client";
import { cn } from "@/lib/cn";
import {
  GREET_EDIT_EVENT,
  getVisitor,
  isValidName,
  normalizeName,
  setVisitor,
  subscribeVisitor,
} from "@/lib/visitor";

const getServerVisitor = () => null;

/**
 * The name slot in "Hello ___, meet Kshitij."
 *
 * Empty: an unresolved Razor placeholder (@Model.Name) styled as a field with
 * a hint, so it is obvious you can click it and type. Filled: the name in the
 * accent colour; click it to change or clear it. A personal link (/?to=Priya)
 * fills it before first paint, and CSS hides the placeholder meanwhile.
 */
export function Greeting() {
  const name = useSyncExternalStore(subscribeVisitor, getVisitor, getServerVisitor);
  // null = not editing
  const [draft, setDraft] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = () => {
    setDraft(getVisitor() ?? "");
    setInvalid(false);
  };

  useEffect(() => {
    const onEdit = () => {
      document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
      setDraft(getVisitor() ?? "");
      setInvalid(false);
    };
    window.addEventListener(GREET_EDIT_EVENT, onEdit);
    return () => window.removeEventListener(GREET_EDIT_EVENT, onEdit);
  }, []);

  useEffect(() => {
    if (draft !== null) inputRef.current?.focus({ preventScroll: true });
  }, [draft !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = (how: "enter" | "blur" | "cancel") => {
    if (draft === null) return;
    if (how === "cancel") return setDraft(null);

    const next = normalizeName(draft);
    if (!next) {
      if (name) setVisitor(null);
      return setDraft(null);
    }
    if (!isValidName(next)) {
      if (how === "blur") return setDraft(null);
      setInvalid(true);
      toast("Letters, spaces and . ' - only (24 max)");
      return;
    }
    if (next !== name) {
      setVisitor(next);
      toast(`Nice to meet you, ${next}.`);
    }
    setDraft(null);
  };

  if (draft !== null) {
    return (
      <span className="relative inline-grid max-w-full align-baseline">
        {/* Invisible copy of the text sizes the field to what is typed */}
        <span aria-hidden="true" className="invisible col-start-1 row-start-1 min-w-0 overflow-hidden whitespace-pre pr-[0.08em]">
          {draft || "Your name"}
        </span>
        <input
          ref={inputRef}
          aria-label="Your name"
          value={draft}
          maxLength={24}
          placeholder="Your name"
          autoComplete="given-name"
          spellCheck={false}
          enterKeyHint="done"
          size={1}
          style={{ outline: "none" }}
          onChange={(e) => {
            setDraft(e.target.value);
            setInvalid(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              finish("enter");
            } else if (e.key === "Escape") {
              finish("cancel");
            }
          }}
          onBlur={() => finish("blur")}
          className={cn(
            "col-start-1 row-start-1 w-full min-w-0 rounded-none border-b-[0.06em] border-dashed bg-transparent p-0 text-accent caret-accent outline-none placeholder:text-accent/35",
            invalid ? "border-red-500" : "border-accent/60",
          )}
        />
      </span>
    );
  }

  if (name) {
    return (
      <button
        type="button"
        onClick={start}
        title="Not you? Click to change"
        className="text-left text-accent decoration-accent/40 decoration-dashed decoration-[0.05em] underline-offset-[0.12em] [overflow-wrap:anywhere] hover:underline"
      >
        {name}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      aria-label="Type your name to personalise this greeting"
      className="greet-placeholder group/greet relative inline-flex items-center whitespace-nowrap rounded-[3px] border border-dashed border-accent/40 px-[0.3em] py-[0.12em] align-[0.55em] font-mono text-[0.32em] font-normal leading-none tracking-[-0.01em] text-accent transition-colors hover:border-accent hover:bg-accent/10"
    >
      @Model.Name
      <span aria-hidden="true" className="boot-caret ml-[2px] inline-block h-[1em] w-px bg-accent" />
      <span
        aria-hidden="true"
        className="greet-hint pointer-events-none absolute bottom-full left-[0.2em] mb-[0.45em] whitespace-nowrap font-mono text-[11px] font-normal normal-case tracking-[.04em] text-muted transition-colors group-hover/greet:text-accent"
      >
        ↓ that&apos;s you. click, type your name
      </span>
    </button>
  );
}
