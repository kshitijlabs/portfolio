"use client";

import { useEffect, useState } from "react";

export const SECTION_IDS = ["work", "about", "stack", "experience", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Which home-page section is crossing the middle of the viewport. */
export function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const top = document.getElementById("top");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setActive(e.target.id === "top" ? null : (e.target.id as SectionId));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    if (top) io.observe(top);
    return () => io.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}
