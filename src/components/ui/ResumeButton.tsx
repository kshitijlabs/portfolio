import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Opens the résumé (a Google Drive link) in a new tab. Renders nothing until site.resumeUrl is set. */
export function ResumeButton({ label = "[ Résumé ↗ ]", className }: { label?: string; className?: string }) {
  if (!site.resumeUrl) return null;
  return (
    <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className={cn("btn", className)}>
      {label}
    </a>
  );
}
