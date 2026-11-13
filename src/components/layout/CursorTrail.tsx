"use client";

import { useEffect, useRef } from "react";

const TRAIL_MS = 260;
const INTERACTIVE = 'a, button, summary, label, select, [role="button"], [cmdk-item]';
/** Places where the system cursor is kept (text fields). */
const NATIVE = 'input, textarea, [contenteditable="true"], [data-native-cursor]';

/**
 * A dot cursor that leaves a short trail of fading dots and grows into a
 * ring over anything clickable. Mouse only: never mounts on touch devices or
 * when the visitor prefers reduced motion. Draws only while something moves.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!fine || reduce || !canvas || !ctx) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let dpr = 1;
    let w = 0;
    let h = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();

    const points: { x: number; y: number; t: number }[] = [];
    let x = -100;
    let y = -100;
    let visible = false;
    let overNative = false;
    let ring = 0;
    let ringTarget = 0;
    let raf = 0;

    const draw = (now: number) => {
      raf = 0;
      while (points.length && now - points[0].t > TRAIL_MS) points.shift();
      ring += (ringTarget - ring) * 0.25;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (visible && !overNative) {
        // Over the dark boot terminal the softer accent reads better.
        const styles = getComputedStyle(root);
        const token = root.classList.contains("booting") ? "--accent-soft" : "--accent";
        const color = styles.getPropertyValue(token).trim() || "#512bd4";
        // A thin halo in the page colour keeps the cursor visible on accent surfaces.
        const halo = styles.getPropertyValue("--paper").trim() || "#efede7";
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        for (const p of points) {
          const life = 1 - (now - p.t) / TRAIL_MS;
          ctx.globalAlpha = life * 0.55;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2 + 3 * life, 0, Math.PI * 2);
          ctx.fill();
        }

        if (ring > 0.02) {
          const r = 4.5 + 12 * ring;
          ctx.globalAlpha = ring;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.strokeStyle = halo;
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, 4.5 - 2.5 * ring, 0, Math.PI * 2);
        ctx.strokeStyle = halo;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();
      }

      if (points.length || Math.abs(ringTarget - ring) > 0.01) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      visible = true;
      const target = e.target instanceof Element ? e.target : null;
      overNative = !!target?.closest(NATIVE);
      ringTarget = target?.closest(INTERACTIVE) ? 1 : 0;
      points.push({ x, y, t: performance.now() });
      if (points.length > 48) points.shift();
      kick();
    };
    const onLeave = () => {
      visible = false;
      points.length = 0;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[110] h-screen w-screen"
    />
  );
}
