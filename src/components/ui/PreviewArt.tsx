import Image from "next/image";
import { cn } from "@/lib/cn";

const VARIANT_COLOR: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "var(--accent)",
  2: "color-mix(in oklab, var(--accent) 45%, var(--ok))",
  3: "color-mix(in oklab, var(--accent) 50%, var(--ink))",
  4: "color-mix(in oklab, var(--ok) 75%, var(--ink))",
  5: "color-mix(in oklab, var(--accent) 35%, var(--muted))",
};

const BARS = [35, 55, 42, 70, 62, 88, 76];

/**
 * A project screenshot when one exists, otherwise an abstract dashboard
 * drawn in the project's colour so the layout still reads.
 */
export function PreviewArt({
  variant,
  image,
  alt,
  className,
  compact = false,
}: {
  variant: 1 | 2 | 3 | 4 | 5;
  image?: string;
  alt: string;
  className?: string;
  compact?: boolean;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={image} alt={alt} fill sizes="(min-width: 768px) 256px, 64px" className="object-cover" />
      </div>
    );
  }

  const pv = VARIANT_COLOR[variant];
  if (compact) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("overflow-hidden", className)}
        style={{ background: `linear-gradient(180deg, ${pv} 0 24%, color-mix(in oklab, ${pv} 14%, var(--paper)) 24% 100%)` }}
      />
    );
  }

  return (
    <div role="img" aria-label={alt} className={cn("flex flex-col overflow-hidden bg-card", className)}>
      <div className="flex gap-1 px-2.5 py-2" style={{ background: pv }}>
        {[0, 1, 2].map((i) => (
          <i key={i} className="size-1.5 rounded-full bg-paper/75" />
        ))}
      </div>
      <div className="grid flex-1 grid-cols-[22%_1fr] gap-2 p-2.5">
        <div className="rounded" style={{ background: `color-mix(in oklab, ${pv} 14%, var(--paper))` }} />
        <div className="grid min-w-0 grid-rows-[auto_1fr] gap-2">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <b key={i} className="h-6 rounded" style={{ background: `color-mix(in oklab, ${pv} 22%, var(--paper))` }} />
            ))}
          </div>
          <div
            className="flex items-end gap-1.5 rounded p-2"
            style={{ background: `color-mix(in oklab, ${pv} 7%, var(--paper))` }}
          >
            {BARS.map((h, i) => (
              <span key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: pv }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
