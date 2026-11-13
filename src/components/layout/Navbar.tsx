"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Command, Moon, Sun } from "lucide-react";
import { site } from "@/content/site";
import { openCommandMenu, toggleTheme } from "@/lib/client";
import { useActiveSection } from "@/lib/use-active-section";
import { cn } from "@/lib/cn";

const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export function Navbar() {
  const onHome = usePathname() === "/";
  const active = useActiveSection(onHome);

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-[max(14px,env(safe-area-inset-top))]">
      <div className="container-x grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="justify-self-start rounded-md bg-paper/80 px-2 py-1.5 font-mono text-[13px] font-bold backdrop-blur-sm"
          aria-label={`${site.name}, home`}
        >
          {site.initials}
          <span className="text-accent">/</span> <span className="font-medium">{site.handle}</span>
        </Link>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-0.5 rounded-full bg-ink p-1 text-paper shadow-float">
            {NAV.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={onHome ? `#${item.id}` : `/#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-[.08em] transition-opacity",
                      isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-paper/15"
                        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <span className="absolute right-1.5 top-1.5 size-[5px] rounded-full bg-accent-soft" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={openCommandMenu}
            className="kbd flex items-center gap-1 px-2.5 py-2 hover:border-accent hover:text-accent"
            aria-label="Open command menu"
          >
            <Command className="size-3" aria-hidden="true" />K
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-[34px] place-items-center rounded-full border border-rule bg-card hover:border-accent hover:text-accent"
            aria-label="Toggle colour theme"
          >
            <Moon className="icon-when-light size-4" aria-hidden="true" />
            <Sun className="icon-when-dark size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
