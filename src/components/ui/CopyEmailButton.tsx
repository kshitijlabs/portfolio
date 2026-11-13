"use client";

import { site } from "@/content/site";
import { copyText } from "@/lib/client";
import { cn } from "@/lib/cn";

export function CopyEmailButton({ label = "[ Copy email ]", solid = false }: { label?: string; solid?: boolean }) {
  return (
    <button type="button" onClick={() => copyText(site.email)} className={cn("btn", solid && "btn-solid")}>
      {label}
    </button>
  );
}
