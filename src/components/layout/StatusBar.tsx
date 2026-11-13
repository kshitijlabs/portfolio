"use client";

import { Fragment, useEffect, useState } from "react";
import { Command } from "lucide-react";
import { site } from "@/content/site";
import { openCommandMenu } from "@/lib/client";
import { cn } from "@/lib/cn";

const COMMIT = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "local";
const BUILT = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";

function zoneTime(now: Date, tz: string) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(now);
}

function zoneName(now: Date, tz: string) {
  return (
    new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? tz
  );
}

/** Local time plus the client time zones you overlap with, e.g. "17:40 IST · 06:10 CST". */
function Clocks() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return site.timeZones.map((z, i) => (
    <Fragment key={z.tz}>
      {i > 0 && <span aria-hidden="true">·</span>}
      <span>
        <b className="font-medium tabular-nums text-ink">{now ? zoneTime(now, z.tz) : "--:--"}</b>{" "}
        {z.label ?? (now ? zoneName(now, z.tz) : "")}
      </span>
    </Fragment>
  ));
}

/** IDE-style status line under the contact section. Dividers only on wide screens. */
export function StatusBar() {
  const cell = "inline-flex items-center gap-2 whitespace-nowrap border-rule px-3 py-2.5";
  return (
    <div
      className="flex flex-wrap items-center overflow-hidden rounded-md border border-rule bg-paper-2 font-mono text-[11px] leading-none text-muted"
      aria-label="Site status"
    >
      <span className={cn(cell, "text-ink md:border-r")}>
        <span className={cn("status-dot", !site.availability.open && "bg-muted shadow-none")} />
        {site.availability.label}
      </span>
      <span className={cn(cell, "md:border-r")}>
        {site.cityShort} <Clocks />
      </span>
      <span className={cn(cell, "md:border-r")}>
        build <b className="font-medium text-ink">{COMMIT}</b>
        {BUILT && <> · {BUILT}</>}
      </span>
      <button
        type="button"
        onClick={openCommandMenu}
        className="ml-auto hidden items-center gap-2 border-l border-rule px-3 py-2.5 hover:text-accent md:inline-flex"
        aria-label="Open command menu"
      >
        <span className="kbd inline-flex items-center gap-0.5">
          <Command className="size-3" aria-hidden="true" />K
        </span>
      </button>
    </div>
  );
}
