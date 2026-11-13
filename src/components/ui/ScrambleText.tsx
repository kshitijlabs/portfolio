"use client";

import { useEffect, useState } from "react";
import { BOOT_DONE_EVENT, isBootPending, prefersReducedMotion } from "@/lib/client";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]#=+*01";

/**
 * Renders `text` normally (server HTML, crawlers, repeat visits).
 * On a first visit it decodes from random glyphs once the boot intro lifts.
 */
export function ScrambleText({
  text,
  delay = 0,
  duration = 650,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!isBootPending() || prefersReducedMotion()) return;
    let raf = 0;
    let timer = 0;

    const run = () => {
      timer = window.setTimeout(() => {
        const t0 = performance.now();
        const frame = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const revealed = Math.floor(p * text.length);
          let out = "";
          for (let i = 0; i < text.length; i++) {
            const c = text[i];
            out += i < revealed || c === " " || c === "." ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          setDisplay(out);
          if (p < 1) raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      }, delay);
    };

    window.addEventListener(BOOT_DONE_EVENT, run, { once: true });
    return () => {
      window.removeEventListener(BOOT_DONE_EVENT, run);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [text, delay, duration]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {/* One span per letter so KineticHeading can push letters around */}
      <span aria-hidden="true">
        {Array.from(display).map((c, i) =>
          c === " " ? " " : (
            <span key={i} className="kch inline-block will-change-transform">
              {c}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
