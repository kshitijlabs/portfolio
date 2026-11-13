"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ArchEdge, ArchNode } from "@/content/projects";
import { cn } from "@/lib/cn";

const W = 170;
const H = 64;
const GAP_X = 70;
const GAP_Y = 96;
const PAD = 20;
const HOP_MS = 700;

const nx = (n: ArchNode) => PAD + n.col * (W + GAP_X);
const ny = (n: ArchNode) => PAD + n.row * (H + GAP_Y);

function edgeGeometry(a: ArchNode, b: ArchNode) {
  if (a.row === b.row) {
    const forward = a.col < b.col;
    const sx = forward ? nx(a) + W : nx(a);
    const ex = forward ? nx(b) - 2 : nx(b) + W + 2;
    const yy = ny(a) + H / 2;
    return { d: `M${sx} ${yy}H${ex}`, lx: (sx + ex) / 2, ly: yy - 10, anchor: "middle" as const };
  }
  const cxA = nx(a) + W / 2;
  const cxB = nx(b) + W / 2;
  const sy = ny(a) + H;
  const ey = ny(b) - 2;
  if (a.col === b.col) {
    return { d: `M${cxA} ${sy}V${ey}`, lx: cxA + 10, ly: (sy + ey) / 2 + 4, anchor: "start" as const };
  }
  const midY = sy + GAP_Y / 2;
  return {
    d: `M${cxA} ${sy}V${midY}H${cxB}V${ey}`,
    lx: (cxA + cxB) / 2,
    ly: midY - 8,
    anchor: "middle" as const,
  };
}

/** The accent edges in travel order: start where no accent edge arrives, follow the chain. */
function hotChain(edges: ArchEdge[]) {
  const hot = edges.filter((e) => e.hot);
  const targets = new Set(hot.map((e) => e.to));
  const chain: ArchEdge[] = [];
  let cur = hot.find((e) => !targets.has(e.from));
  while (cur && chain.length < hot.length) {
    chain.push(cur);
    const at: string = cur.to;
    cur = hot.find((e) => e.from === at);
  }
  return chain;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * System diagram drawn from data. When it scrolls into view, a request packet
 * travels the accent path node by node, the response travels back, and a
 * terminal line underneath narrates both. Loops while visible; static for
 * reduced motion.
 */
export function ArchitectureDiagram({
  id,
  nodes,
  edges,
  label,
  trace,
}: {
  id: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  label: string;
  trace: { request: string; response: string };
}) {
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const width = PAD * 2 + cols * W + (cols - 1) * GAP_X;
  const height = PAD * 2 + rows * H + (rows - 1) * GAP_Y;
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const chain = useMemo(() => hotChain(edges), [edges]);

  const rootRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<SVGGElement>(null);
  const logRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const packet = packetRef.current;
    const log = logRef.current;
    if (!root || !packet || !log || chain.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paths = chain.map((e) => root.querySelector<SVGPathElement>(`[data-edge="${e.from}-${e.to}"]`)!);
    const lens = paths.map((p) => p.getTotalLength());
    const nodeEl = (nid: string) => root.querySelector<SVGGElement>(`[data-node="${nid}"]`);
    const order = [chain[0].from, ...chain.map((e) => e.to)];
    const hops = chain.length;
    // forward hops, a beat at the end, the same hops back, then a rest
    const total = hops * HOP_MS * 2 + 500 + 1800;

    let raf = 0;
    let t0 = 0;
    let lastPhase = "";

    const setLog = (phase: string, html: string) => {
      if (phase === lastPhase) return;
      lastPhase = phase;
      log.innerHTML = html;
    };
    const light = (active: string | null) => {
      for (const nid of order) nodeEl(nid)?.toggleAttribute("data-on", nid === active);
    };

    const frame = (now: number) => {
      if (!t0) t0 = now;
      const t = (now - t0) % total;
      const fwdEnd = hops * HOP_MS;
      const backStart = fwdEnd + 500;
      const backEnd = backStart + hops * HOP_MS;

      let hop = -1;
      let p = 0;
      let back = false;
      if (t < fwdEnd) {
        hop = Math.floor(t / HOP_MS);
        p = ease((t % HOP_MS) / HOP_MS);
        light(order[hop]);
        setLog("req", `<span class="text-accent-soft">→</span> ${escapeHtml(trace.request)}`);
      } else if (t < backStart) {
        light(order[hops]);
        setLog("work", `<span class="text-accent-soft">…</span> ${escapeHtml(byId.get(order[hops])?.title ?? "")} working`);
      } else if (t < backEnd) {
        back = true;
        const bt = t - backStart;
        hop = hops - 1 - Math.floor(bt / HOP_MS);
        p = ease((bt % HOP_MS) / HOP_MS);
        light(order[hop + 1]);
        setLog("res", `<span class="text-term-ok">←</span> ${escapeHtml(trace.response)}`);
      } else {
        light(order[0]);
      }

      if (hop >= 0) {
        const len = lens[hop];
        const pt = paths[hop].getPointAtLength(back ? len * (1 - p) : len * p);
        packet.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        packet.style.opacity = "1";
        packet.toggleAttribute("data-back", back);
      } else {
        packet.style.opacity = "0";
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) {
          t0 = 0;
          raf = requestAnimationFrame(frame);
        } else {
          light(null);
        }
      },
      { threshold: 0.45 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [chain, byId, trace]);

  return (
    <div ref={rootRef} className="arch">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={label}
          className="block h-auto w-full min-w-[720px] font-mono"
        >
          <defs>
            <marker id={`${id}-ah`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" className="fill-muted" />
            </marker>
            <marker id={`${id}-ahh`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" className="fill-accent" />
            </marker>
          </defs>

          {edges.map((e) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b) return null;
            const g = edgeGeometry(a, b);
            return (
              <g key={`${e.from}-${e.to}`}>
                <path
                  d={g.d}
                  data-edge={`${e.from}-${e.to}`}
                  fill="none"
                  strokeDasharray={e.dashed ? "4 4" : undefined}
                  strokeWidth={e.hot ? 1.8 : 1.3}
                  className={e.hot ? "stroke-accent" : "stroke-muted"}
                  markerEnd={`url(#${id}-${e.hot ? "ahh" : "ah"})`}
                />
                {e.label && (
                  <text x={g.lx} y={g.ly} textAnchor={g.anchor} className="fill-muted text-[10.5px]">
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {nodes.map((n) => (
            <g key={n.id} data-node={n.id} className="arch-node">
              <rect
                x={nx(n)}
                y={ny(n)}
                width={W}
                height={H}
                rx={6}
                strokeWidth={n.hot ? 1.6 : 1.2}
                className={cn("fill-card", n.hot ? "stroke-accent" : "stroke-rule")}
              />
              <text x={nx(n) + 14} y={ny(n) + 28} className="fill-ink text-[12.5px] font-bold">
                {n.title}
              </text>
              <text x={nx(n) + 14} y={ny(n) + 46} className="fill-muted text-[11px]">
                {n.sub}
              </text>
            </g>
          ))}

          <g ref={packetRef} className="arch-packet" style={{ opacity: 0 }} aria-hidden="true">
            <circle r={11} className="arch-packet-halo" />
            <circle r={5} className="arch-packet-dot" />
          </g>
        </svg>
      </div>
      <p
        ref={logRef}
        aria-hidden="true"
        className="mt-3 min-h-[1.5em] truncate rounded-md bg-term px-3 py-2 font-mono text-[11.5px] text-term-ink"
      >
        <span className="text-accent-soft">→</span> {trace.request}{" "}
        <span className="text-term-dim">·</span> <span className="text-term-ok">←</span> {trace.response}
      </p>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
