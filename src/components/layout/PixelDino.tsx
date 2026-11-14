"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { BOOT_DONE_EVENT, isBootPending, isPetEnabled, subscribePet } from "@/lib/client";
import { VISITOR_EVENT } from "@/lib/visitor";

// ---------- Sprite: an original 18×10 pixel stegosaurus, facing right ----------
// a = body (accent), s = plates and belly, . = empty. Each pixel is drawn 3px.
const BODY = [
  "..............aaa.",
  "......s..s...aaaaa",
  ".....ss.ss.s.aaaaa",
  "....aaaaaaaaaaaa..",
  "...aaaaaaaaaaaaa..",
  "aaaaaaaaaaaaaaa...",
  ".aaassssssssaaa...",
  "...aaaaaaaaaaa....",
];
const LEGS_STAND = ["....aa.aa..aa.aa..", "....aa.aa..aa.aa.."];
const LEGS_STRIDE = ["....aa.aa..aa.aa..", "...aa...aa.aa...aa"];
const PX = 3;
const W = 18 * PX;

const FILL: Record<string, string> = { a: "fill-accent", s: "fill-pet-2" };

/** Merge each row's same-coloured pixels into one rect. */
function rects(rows: string[], y0: number) {
  const out: { x: number; y: number; w: number; c: string }[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let end = x;
      while (row[end + 1] === c) end++;
      if (c !== ".") out.push({ x, y: y + y0, w: end - x + 1, c });
      x = end + 1;
    }
  });
  return out;
}

function Pixels({ rows, y0 }: { rows: string[]; y0: number }) {
  return rects(rows, y0).map((r) => (
    <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} className={FILL[r.c]} />
  ));
}

const LINES = [
  "It works on my machine.",
  "SELECT * FROM snacks;",
  "200 OK",
  "NullReferenceException? Not today.",
  "dotnet run --zoomies",
  "git commit -m \"rawr\"",
  "Survived the meteor. And IE11.",
  `Hire ${site.firstName}. I'm biased.`,
  "Rawr means hello.",
  "Scroll faster. I dare you.",
];

/** Said once per page view when the dino reaches a section's flag. */
const SECTION_LINES: Record<string, string> = {
  work: "These all shipped to prod.",
  about: "He reads stack traces for fun.",
  stack: "SQL Server is my fave. Don't tell React.",
  experience: "5+ years. Zero meteors.",
  contact: "Go on, say hi. He replies within a day.",
};

type Section = { id: string; label: string; p: number };
type Mark = { id: string; label: string; x: number };

/** Where on the track (px from the left) a scroll progress of p puts the dino. */
const trackX = (p: number) => 6 + p * (window.innerWidth - W - 12);

type Bubble = string | null;

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(reducedQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(reducedQuery).matches;
const off = () => false;

/**
 * A small pixel dinosaur that wanders along the bottom of the screen.
 * It runs when you scroll, naps when you go quiet, jumps and talks when you
 * click it, and gets the zoomies if you click it five times. Hidden for
 * reduced motion; ⌘K → "dinosaur" sends it away (remembered).
 */
export function PixelDino() {
  const enabled = useSyncExternalStore(subscribePet, isPetEnabled, off);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, off);
  const show = enabled && !reduced;

  const [bubble, setBubble] = useState<Bubble>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const standRef = useRef<SVGGElement>(null);
  const strideRef = useRef<SVGGElement>(null);
  const eyeRef = useRef<SVGRectElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const api = useRef<{ poke: () => void; hover: (on: boolean) => void } | null>(null);

  // Section flags along the ground line (home page only).
  const pathname = usePathname();
  const sectionsRef = useRef<Section[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [activeMark, setActiveMark] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const els = Array.from(document.querySelectorAll<HTMLElement>("main section[id]")).filter(
          (el) => el.id !== "top",
        );
        const list: Section[] =
          max > 0
            ? els.map((el) => ({
                id: el.id,
                label: el.getAttribute("aria-label") ?? el.id,
                p: Math.min(1, Math.max(0, (el.offsetTop - 140) / max)),
              }))
            : [];
        sectionsRef.current = list;
        setMarks(list.map((m) => ({ id: m.id, label: m.label, x: trackX(m.p) + W / 2 })));
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [show, pathname]);

  useEffect(() => {
    if (!show) return;
    const root = rootRef.current!;
    const jumpEl = jumpRef.current!;
    const svg = svgRef.current!;
    const stand = standRef.current!;
    const stride = strideRef.current!;
    const eye = eyeRef.current!;
    const shadow = shadowRef.current!;

    let last = performance.now();
    let x = -W;
    let dir = 1;
    let mode: "walk" | "idle" | "sleep" = "walk";
    let until = last + 7000;
    let y = 0;
    let vy = 0;
    let frame = 0;
    let frameT = 0;
    let lastActive = last;
    let followUntil = 0;
    let scrollY = window.scrollY;
    let section: string | null = null;
    const greeted = new Set<string>();
    let zoomUntil = 0;
    let hovered = false;
    let clicks: number[] = [];
    let lineIdx = Math.floor(Math.random() * LINES.length);
    let bubbleTimer = 0;
    let raf = 0;

    const say = (text: string | null, ms = 2600) => {
      clearTimeout(bubbleTimer);
      if (!text) return setBubble(null);
      setBubble(text);
      if (ms > 0) bubbleTimer = window.setTimeout(() => setBubble(null), ms);
    };
    const jump = (power = 560) => {
      if (y === 0) vy = power;
    };
    const wake = (line: string) => {
      if (mode !== "sleep") return;
      mode = "walk";
      until = performance.now() + 4000;
      jump(420);
      say(line, 1400);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const zoom = now < zoomUntil;
      const following = !zoom && now < followUntil;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const target = trackX(progress);

      if (mode !== "sleep" && !zoom && now - lastActive > 30000) {
        mode = "sleep";
        say("z z z", 0);
      }
      if (!following && !zoom && mode !== "sleep" && now > until) {
        if (mode === "walk" && Math.random() < 0.45) {
          mode = "idle";
          until = now + 1500 + Math.random() * 2500;
        } else {
          mode = "walk";
          if (Math.random() < 0.3) dir = -dir;
          until = now + 3000 + Math.random() * 5000;
        }
      }

      let speed = 0;
      if (zoom) speed = 380;
      else if (mode === "sleep") speed = 0;
      else if (following) {
        // Scrolling: run to the spot on the track that matches the scroll position.
        const dist = target - x;
        if (Math.abs(dist) > 3) {
          dir = dist > 0 ? 1 : -1;
          speed = Math.min(560, Math.max(70, Math.abs(dist) * 5));
        }
      } else if (mode === "walk" && !hovered) {
        speed = 42;
        // Wander, but stay near your place on the track.
        if (Math.abs(target - x) > 110) dir = target > x ? 1 : -1;
      }

      x += dir * speed * dt;
      const right = window.innerWidth - W - 6;
      if (x > right) {
        x = right;
        dir = -1;
      } else if (x < 6 && dir < 0) {
        x = 6;
        dir = 1;
      }

      if (y > 0 || vy > 0) {
        vy -= 2200 * dt;
        y = Math.max(0, y + vy * dt);
        if (y === 0) vy = 0;
      }

      // Reached a new section's flag: say something about it, once.
      const secs = sectionsRef.current;
      let here: string | null = null;
      for (const sec of secs) if (progress >= sec.p - 0.004) here = sec.id;
      if (here !== section) {
        section = here;
        setActiveMark(here);
        if (here && !greeted.has(here) && SECTION_LINES[here] && mode !== "sleep") {
          greeted.add(here);
          if (secs.length && now > 4000) say(SECTION_LINES[here], 2800);
        }
      }

      const moving = speed > 0 && y === 0;
      frameT += dt * 1000;
      if (moving && frameT > (speed > 200 ? 70 : 150)) {
        frame ^= 1;
        frameT = 0;
      } else if (!moving) {
        frame = y > 0 ? 1 : 0;
      }

      root.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      jumpEl.style.transform = `translate3d(0,${(-y).toFixed(1)}px,0)`;
      svg.style.transform = dir < 0 ? "scaleX(-1)" : "";
      stand.style.display = frame ? "none" : "";
      stride.style.display = frame ? "" : "none";
      eye.style.display = mode === "sleep" ? "none" : "";
      const s = Math.max(0.4, 1 - y / 120);
      shadow.style.transform = `translateX(-50%) scale(${s.toFixed(2)})`;
      shadow.style.opacity = s.toFixed(2);

      // Keep the speech bubble on screen when the dino is near an edge.
      const b = bubbleRef.current;
      if (b) {
        const shift = parseFloat(b.style.marginLeft) || 0;
        const r = b.getBoundingClientRect();
        const left = r.left - shift;
        const right = r.right - shift;
        const next = left < 8 ? 8 - left : right > window.innerWidth - 8 ? window.innerWidth - 8 - right : 0;
        if (Math.abs(next - shift) > 0.5) b.style.marginLeft = `${next.toFixed(1)}px`;
      }

      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const now = performance.now();
      const delta = window.scrollY - scrollY;
      scrollY = window.scrollY;
      if (Math.abs(delta) < 2) return;
      followUntil = now + 1400;
      lastActive = now;
      wake("!");
    };
    const onActivity = () => {
      lastActive = performance.now();
    };
    const onVisitor = (e: Event) => {
      const name = (e as CustomEvent<string | null>).detail;
      lastActive = performance.now();
      if (mode === "sleep") mode = "idle";
      jump();
      say(name ? `Hi ${name}!` : "Bye, stranger.");
    };

    api.current = {
      poke: () => {
        const now = performance.now();
        lastActive = now;
        if (mode === "sleep") return wake("huh? oh, hi.");
        clicks = [...clicks.filter((t) => now - t < 1500), now];
        jump();
        if (clicks.length >= 5) {
          clicks = [];
          zoomUntil = now + 2600;
          say("ZOOMIES!", 2400);
          return;
        }
        lineIdx = (lineIdx + 1 + Math.floor(Math.random() * (LINES.length - 1))) % LINES.length;
        say(LINES[lineIdx]);
      },
      hover: (on) => {
        hovered = on;
      },
    };

    // Say hello once the boot intro is out of the way.
    let helloTimer = 0;
    const hello = () => {
      helloTimer = window.setTimeout(() => {
        const name = document.documentElement.dataset.visitor;
        say(name ? `Hi ${name}! Click me.` : "psst… click me", 3200);
      }, 2200);
    };
    if (isBootPending()) window.addEventListener(BOOT_DONE_EVENT, hello, { once: true });
    else hello();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener(VISITOR_EVENT, onVisitor);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bubbleTimer);
      clearTimeout(helloTimer);
      window.removeEventListener(BOOT_DONE_EVENT, hello);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener(VISITOR_EVENT, onVisitor);
      api.current = null;
      setBubble(null);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {marks.length > 0 && (
        <nav
          aria-label="Page sections"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-20 hidden h-[18px] border-t border-dashed border-rule md:block"
        >
          {marks.map((m) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className={
                "pointer-events-auto absolute top-0 -translate-x-1/2 px-1 pt-[3px] font-mono text-[9px] uppercase leading-none tracking-[.08em] transition-colors hover:text-accent " +
                (activeMark === m.id ? "text-accent" : "text-muted/70")
              }
              style={{ left: m.x }}
            >
              {m.label}
            </a>
          ))}
        </nav>
      )}
      <div
        ref={rootRef}
        className={
          "pointer-events-none fixed bottom-[calc(max(12px,env(safe-area-inset-bottom))+66px)] left-0 z-30 " +
          (marks.length > 0 ? "md:bottom-[18px]" : "md:bottom-2")
        }
        style={{ transform: `translate3d(${-W}px,0,0)` }}
      >
        <div
          ref={shadowRef}
          aria-hidden="true"
          className="absolute -bottom-[3px] left-1/2 h-[5px] w-[46px] rounded-full bg-ink/15"
          style={{ transform: "translateX(-50%)" }}
        />
        <div ref={jumpRef} className="relative">
          {bubble && (
            <span
              ref={bubbleRef}
              className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 font-mono text-[11px] leading-none text-paper shadow-float"
            >
              {bubble}
            </span>
          )}
          <button
            type="button"
            aria-label="Poke the dinosaur"
            onClick={() => api.current?.poke()}
            onPointerEnter={() => api.current?.hover(true)}
            onPointerLeave={() => api.current?.hover(false)}
            className="pointer-events-auto block rounded-sm"
          >
            <svg
              ref={svgRef}
              width={W}
              height={10 * PX}
              viewBox="0 0 18 10"
              shapeRendering="crispEdges"
              aria-hidden="true"
              className="block"
            >
              <Pixels rows={BODY} y0={0} />
              <rect ref={eyeRef} x={15} y={1} width={1} height={1} className="fill-[#1a1916]" />
              <g ref={standRef}>
                <Pixels rows={LEGS_STAND} y0={8} />
              </g>
              <g ref={strideRef} style={{ display: "none" }}>
                <Pixels rows={LEGS_STRIDE} y0={8} />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
