"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { markBootDone, prefersReducedMotion } from "@/lib/client";
import { site } from "@/content/site";

const CMD = "dotnet run --project Portfolio.Web -c Release";
const LINES: [string, string, string][] = [
  ["Determining projects to restore", "done", "142 ms"],
  ["Portfolio.Api → bin/Release/net10.0/Portfolio.Api.dll", "built", "0.61 s"],
  ["Connecting to Azure SQL · portfolio-db", "ok", "12 ms"],
  ["Hydrating React client", "ok", "386 ms"],
  ["GET /healthz", "200", "38 ms"],
];
const HOST = site.url.replace(/^https?:\/\//, "");

class Cancelled extends Error {}

/**
 * First-visit intro: a PowerShell window "boots" the site, then lifts away.
 * The real page is already rendered underneath, so nothing is hidden from
 * crawlers. An inline script in <head> adds `html.booting` only when this
 * browser session has not seen the intro yet.
 */
export function BootLoader() {
  const [typed, setTyped] = useState("");
  const [lines, setLines] = useState(0);
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 1 = build succeeded, 2 = listening
  const [exit, setExit] = useState<null | "lift" | "fade">(null);
  const skip = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("booting")) {
      markBootDone();
      return;
    }

    const reduce = prefersReducedMotion();
    if (reduce) skip.current = true;
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) =>
        setTimeout(() => (cancelled ? reject(new Cancelled()) : resolve()), ms),
      );
    const step = (ms: number) => (skip.current ? sleep(0) : sleep(ms));
    const onSkip = () => {
      skip.current = true;
    };
    window.addEventListener("keydown", onSkip);
    window.addEventListener("pointerdown", onSkip);

    (async () => {
      for (let i = 1; i <= CMD.length && !skip.current; i++) {
        setTyped(CMD.slice(0, i));
        await step(8);
      }
      setTyped(CMD);
      await step(120);
      for (let i = 1; i <= LINES.length; i++) {
        setLines(i);
        await step(150);
      }
      setStage(1);
      await step(170);
      setStage(2);
      await sleep(reduce ? 400 : skip.current ? 120 : 280);

      setExit(reduce ? "fade" : "lift");
      markBootDone();
      await sleep(reduce ? 250 : 660);

      root.classList.remove("booting");
      try {
        sessionStorage.setItem("booted", "1");
      } catch {
        /* storage blocked: the intro may replay next visit, which is fine */
      }
    })().catch((e) => {
      if (!(e instanceof Cancelled)) throw e;
    });

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
    };
  }, []);

  const progress = stage > 0 ? 100 : Math.round((lines / (LINES.length + 1)) * 100);
  const blocks = Math.round(progress / 5);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "boot fixed inset-0 z-[100] items-center justify-center bg-term text-term-ink",
        "transition-[transform,opacity] duration-[640ms] ease-[cubic-bezier(.76,0,.24,1)]",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-accent-soft",
        exit === "lift" && "is-lift",
        exit === "fade" && "is-fade",
      )}
    >
      <div className="w-full max-w-[720px] px-5 font-mono text-[11px] leading-[1.85] sm:px-8 sm:text-[13.5px]">
        <div className="mb-3.5 flex justify-between gap-3 border-b border-term-2 pb-2.5 text-[0.85em] text-term-dim">
          <span>Windows PowerShell</span>
          <span>{HOST}</span>
        </div>

        <div className="truncate">
          <span className="text-term-dim">PS C:\src\portfolio&gt;</span> {typed}
          {stage === 0 && (
            <span className="boot-caret ml-0.5 inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-term-ink" />
          )}
        </div>

        <div className="mt-1.5 min-h-[9.5em]">
          {LINES.slice(0, lines).map(([text, status, ms]) => (
            <div key={text} className="boot-line flex items-baseline gap-2.5 whitespace-nowrap pl-[2ch]">
              <span className="min-w-0 truncate">{text}</span>
              <span className="min-w-3 flex-1 -translate-y-[0.3em] border-b border-dotted border-term-dim/70" />
              <span className="text-term-ok">{status}</span>
              <span className="min-w-[6.5ch] text-right text-term-dim">{ms}</span>
            </div>
          ))}
          {stage >= 1 && (
            <div className="boot-line mt-2 flex flex-wrap gap-x-3">
              <span className="font-bold text-accent-soft">Build succeeded.</span>
              <span className="text-term-dim">0 Warning(s) · 0 Error(s) · 00:00:01.42</span>
            </div>
          )}
          {stage >= 2 && (
            <div className="boot-line text-term-dim">
              Now listening on: <span className="text-term-ink">{site.url}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3.5 border-t border-term-2 pt-3 text-[0.85em] text-term-dim">
          <span className="tracking-[.05em] text-accent-soft">
            {"■".repeat(blocks)}
            {"·".repeat(20 - blocks)}
          </span>
          <span className="tabular-nums text-term-ink">{progress}%</span>
          <span className="ml-auto">click or press any key to skip</span>
        </div>
      </div>
    </div>
  );
}
