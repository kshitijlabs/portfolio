"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Layers, Mail, User } from "lucide-react";
import { useActiveSection } from "@/lib/use-active-section";
import { cn } from "@/lib/cn";

const ITEMS = [
  { id: "work", label: "Work", Icon: Briefcase },
  { id: "about", label: "About", Icon: User },
  { id: "stack", label: "Stack", Icon: Layers },
  { id: "contact", label: "Contact", Icon: Mail },
] as const;

/** Bottom navigation for phones, where thumbs reach. */
export function MobileDock() {
  const onHome = usePathname() === "/";
  const active = useActiveSection(onHome);

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 md:hidden"
    >
      <ul className="flex items-center gap-1 rounded-full bg-ink p-1.5 text-paper shadow-float">
        {ITEMS.map(({ id, label, Icon }) => (
          <li key={id} className="flex-1">
            <Link
              href={onHome ? `#${id}` : `/#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={cn(
                "grid place-items-center gap-0.5 rounded-full py-1.5 font-mono text-[9px] uppercase tracking-[.06em] transition",
                active === id ? "bg-paper/15 opacity-100" : "opacity-65",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
