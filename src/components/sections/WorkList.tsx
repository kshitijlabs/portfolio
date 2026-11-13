"use client";

import { useRef, useState, ViewTransition } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Project } from "@/content/projects";
import { PreviewArt } from "@/components/ui/PreviewArt";
import { cn } from "@/lib/cn";

type Row = Pick<Project, "slug" | "title" | "scope" | "kind" | "stack" | "variant" | "image">;

/** Large project index. On pointer devices a preview follows the cursor. */
export function WorkList({ projects }: { projects: Row[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !listRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    x.set(Math.min(Math.max(e.clientX - r.left + 160, 140), r.width - 140));
    y.set(e.clientY - r.top);
  };

  const current = hover === null ? null : projects[hover];

  return (
    <ol
      ref={listRef}
      className="relative"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHover(null)}
    >
      {projects.map((p, i) => (
        <li key={p.slug}>
          <Link
            href={`/work/${p.slug}`}
            // Static export writes per-segment prefetch files for dynamic routes under a
            // different path than the client requests (Next 16.4), so prefetching 404s.
            // Navigation falls back to the full page payload, which exports correctly.
            prefetch={false}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className={cn(
              "group grid items-center gap-x-3.5 gap-y-1 border-b border-rule py-4 transition-opacity duration-300",
              "grid-cols-[56px_minmax(0,1fr)_auto]",
              "md:grid-cols-[56px_minmax(0,1fr)_minmax(0,260px)_72px] md:items-baseline md:gap-x-5 md:py-6",
              hover !== null && hover !== i && "md:opacity-30",
            )}
          >
            <span
              className={cn("hidden font-mono text-xs md:block", hover === i ? "text-accent" : "text-muted")}
            >
              [{String(i + 1).padStart(2, "0")}]
            </span>
            <PreviewArt
              compact
              variant={p.variant}
              image={p.image}
              alt=""
              className="row-span-2 size-14 rounded-md border border-rule md:hidden"
            />
            {/* Morphs into the case study's <h1> on navigation */}
            <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
              <span
                className={cn(
                  "font-display text-[22px] font-bold leading-none tracking-[-0.035em] transition-colors md:text-[clamp(30px,4.2vw,52px)]",
                  hover === i && "text-accent",
                )}
              >
                {p.title}
                <sup className="relative top-[0.35em] ml-2 hidden align-top font-mono text-[10.5px] font-medium tracking-[.06em] text-muted md:inline">
                  [{p.scope}]
                </sup>
              </span>
            </ViewTransition>
            <span className="col-start-2 col-end-4 font-mono text-[10.5px] leading-normal text-muted md:col-auto md:text-xs">
              {p.stack.join(" · ")}
            </span>
            <span className="row-start-1 col-start-3 text-right font-mono text-[11px] uppercase tracking-[.06em] text-muted md:col-auto md:row-auto">
              {p.kind}
            </span>
          </Link>
        </li>
      ))}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 hidden w-64 -translate-x-1/2 -translate-y-1/2 md:block"
        style={{ left: sx, top: sy }}
        initial={false}
        animate={{ opacity: current ? 1 : 0, scale: current ? 1 : 0.9, rotate: -2 }}
        transition={{ duration: 0.22 }}
      >
        {current && (
          <PreviewArt
            variant={current.variant}
            image={current.image}
            alt=""
            className="aspect-[4/3] rounded-lg border border-rule shadow-float"
          />
        )}
      </motion.div>
    </ol>
  );
}
