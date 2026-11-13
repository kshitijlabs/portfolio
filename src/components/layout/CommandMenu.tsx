"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import { ArrowRight, ArrowUpRight, Copy, FileText, Hand, PawPrint, SunMoon } from "lucide-react";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { CMDK_OPEN_EVENT, copyText, togglePet, toggleTheme } from "@/lib/client";
import { editGreeting } from "@/lib/visitor";

const SECTIONS = [
  ["work", "Selected work"],
  ["about", "About"],
  ["stack", "Stack"],
  ["experience", "Experience"],
  ["contact", "Contact"],
] as const;

/** ⌘K / Ctrl+K palette for jumping around and quick actions. */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(CMDK_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(CMDK_OPEN_EVENT, onOpen);
    };
  }, []);

  // The greeting lives on the home page; elsewhere, go there first.
  const sayHello = () => (pathname === "/" ? editGreeting() : router.push("/"));

  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      overlayClassName="cmdk-overlay"
      contentClassName="cmdk-content"
    >
      <Command.Input placeholder="Jump to a section, project or action…" />
      <Command.List>
        <Command.Empty>Nothing matches that.</Command.Empty>

        <Command.Group heading="Sections">
          {SECTIONS.map(([id, label]) => (
            <Command.Item key={id} value={`section ${label}`} onSelect={run(() => router.push(`/#${id}`))}>
              <ArrowRight className="size-4 text-muted" aria-hidden="true" />
              {label}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Projects">
          {projects.map((p) => (
            <Command.Item
              key={p.slug}
              value={`project ${p.title} ${p.stack.join(" ")}`}
              onSelect={run(() => router.push(`/work/${p.slug}`))}
            >
              <ArrowRight className="size-4 text-muted" aria-hidden="true" />
              {p.title}
              <span className="ml-auto font-mono text-[11px] text-muted">{p.scope}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item value="copy email address" onSelect={run(() => copyText(site.email))}>
            <Copy className="size-4 text-muted" aria-hidden="true" />
            Copy email address
          </Command.Item>
          <Command.Item value="toggle theme dark light" onSelect={run(toggleTheme)}>
            <SunMoon className="size-4 text-muted" aria-hidden="true" />
            Switch light / dark theme
          </Command.Item>
          <Command.Item value="say hello greeting your name" onSelect={run(sayHello)}>
            <Hand className="size-4 text-muted" aria-hidden="true" />
            Put your name in the greeting
          </Command.Item>
          <Command.Item value="dinosaur dino pet hide show" onSelect={run(togglePet)}>
            <PawPrint className="size-4 text-muted" aria-hidden="true" />
            Hide / bring back the dinosaur
          </Command.Item>
          {site.resumeUrl && (
            <Command.Item
              value="resume cv pdf"
              onSelect={run(() => window.open(site.resumeUrl ?? undefined, "_blank"))}
            >
              <FileText className="size-4 text-muted" aria-hidden="true" />
              Open résumé
            </Command.Item>
          )}
          {site.socials.map((s) => (
            <Command.Item
              key={s.label}
              value={`open ${s.label}`}
              onSelect={run(() => window.open(s.href, "_blank", "noopener"))}
            >
              <ArrowUpRight className="size-4 text-muted" aria-hidden="true" />
              Open {s.label}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
