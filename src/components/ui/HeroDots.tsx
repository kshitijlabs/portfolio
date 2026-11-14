"use client";

import { useEffect, useRef } from "react";

/**
 * Dot-grid backdrop for the hero only. On mouse devices the dots around the
 * cursor light up in the accent colour (a CSS mask that follows --mx/--my).
 * It fades out at the bottom, so the sections below keep a plain background.
 */
export function HeroDots() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let cx = 0;
    let cy = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${cx - r.left}px`);
      el.style.setProperty("--my", `${cy - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cx = e.clientX;
      cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "-999px");
      el.style.setProperty("--my", "-999px");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="hero-dots" />;
}
