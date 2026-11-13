"use client";

import { useEffect, useRef } from "react";

const RADIUS = 130;
const PUSH = 26;

/**
 * An <h1> whose letters (the .kch spans ScrambleText renders) lean away from
 * the cursor and spring back. Click the heading and they scatter, then
 * re-form. Mouse only; nothing moves for reduced motion.
 */
export function KineticHeading({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h1 = ref.current;
    if (!h1) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type Letter = { el: HTMLElement; x: number; y: number; r: number; vx: number; vy: number; vr: number };
    let letters: Letter[] = [];
    let centers: { cx: number; cy: number }[] = [];
    let px = -1e4;
    let py = -1e4;
    let raf = 0;

    const collect = () => {
      const els = Array.from(h1.querySelectorAll<HTMLElement>(".kch"));
      if (els.length !== letters.length || els.some((el, i) => letters[i]?.el !== el)) {
        letters = els.map((el) => ({ el, x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 }));
      }
      // Centres without the current offset, so the field does not chase itself.
      centers = letters.map((l) => {
        const b = l.el.getBoundingClientRect();
        return { cx: b.left + b.width / 2 - l.x, cy: b.top + b.height / 2 - l.y };
      });
    };

    const step = () => {
      raf = 0;
      let moving = false;
      letters.forEach((l, i) => {
        const c = centers[i];
        let tx = 0;
        let ty = 0;
        let tr = 0;
        if (c) {
          const dx = c.cx - px;
          const dy = c.cy - py;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS && d > 0.01) {
            const f = (1 - d / RADIUS) ** 2;
            tx = (dx / d) * PUSH * f;
            ty = (dy / d) * PUSH * f;
            tr = (dx / d) * 14 * f;
          }
        }
        // spring toward the target
        l.vx = (l.vx + (tx - l.x) * 0.18) * 0.72;
        l.vy = (l.vy + (ty - l.y) * 0.18) * 0.72;
        l.vr = (l.vr + (tr - l.r) * 0.18) * 0.72;
        l.x += l.vx;
        l.y += l.vy;
        l.r += l.vr;
        if (Math.abs(l.x) + Math.abs(l.y) + Math.abs(l.r) + Math.abs(l.vx) + Math.abs(l.vy) > 0.05) moving = true;
        else l.x = l.y = l.r = 0;
        l.el.style.transform = l.x || l.y || l.r ? `translate(${l.x.toFixed(2)}px,${l.y.toFixed(2)}px) rotate(${l.r.toFixed(2)}deg)` : "";
      });
      if (moving) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const b = h1.getBoundingClientRect();
      const near =
        e.clientX > b.left - RADIUS && e.clientX < b.right + RADIUS && e.clientY > b.top - RADIUS && e.clientY < b.bottom + RADIUS;
      if (!near && px < -1e3) return;
      if (!near) {
        px = py = -1e4;
      } else {
        if (px < -1e3) collect();
        px = e.clientX;
        py = e.clientY;
      }
      kick();
    };
    const onScrollOrResize = () => {
      if (px > -1e3) collect();
    };
    // Click the heading (not the name field): letters scatter and re-form.
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("button, input")) return;
      collect();
      letters.forEach((l) => {
        l.vx += (Math.random() - 0.5) * 60;
        l.vy += (Math.random() - 0.7) * 50;
        l.vr += (Math.random() - 0.5) * 70;
      });
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    h1.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      h1.removeEventListener("click", onClick);
      letters.forEach((l) => (l.el.style.transform = ""));
    };
  }, []);

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}
