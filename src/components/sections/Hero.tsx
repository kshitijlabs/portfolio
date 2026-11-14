import Link from "next/link";
import { site } from "@/content/site";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { Greeting } from "@/components/ui/Greeting";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { HeroDots } from "@/components/ui/HeroDots";

function SpecCard() {
  const rows = [...site.spec, ["Status", site.availability.open ? "● Available" : "● Not looking"]] as const;
  return (
    <figure
      aria-label="Profile summary"
      className="relative min-w-0 rounded-md border border-dashed border-muted/60 bg-card px-5 pb-5 pt-4 font-mono text-[12.5px] leading-[1.8]
        before:absolute before:-left-[5px] before:-top-[8px] before:text-xs before:text-muted before:content-['+']
        after:absolute after:-bottom-[8px] after:-right-[5px] after:text-xs after:text-muted after:content-['+']"
    >
      <figcaption className="mb-2.5 flex justify-between gap-3 border-b border-dashed border-rule pb-2.5 text-[11px] text-muted">
        <span>appsettings.Production.json</span>
        <span>UTF-8</span>
      </figcaption>
      <pre className="overflow-x-auto font-[inherit]">
        <code>
          <span className="text-muted">{"{"}</span>
          {"\n"}
          {rows.map(([k, v], i) => (
            <span key={k}>
              {"  "}
              <span className="text-muted">&quot;{k}&quot;:</span>{" "}
              <span className={k === "Status" ? "text-accent" : "text-ink"}>&quot;{v}&quot;</span>
              {i < rows.length - 1 && <span className="text-muted">,</span>}
              {"\n"}
            </span>
          ))}
          <span className="text-muted">{"}"}</span>
        </code>
      </pre>
    </figure>
  );
}

export function Hero() {
  return (
    // Full-width wrapper so the dot grid spans the screen while the content stays in the container.
    <div className="relative isolate">
      <HeroDots />
      <section id="top" className="container-x pb-16 pt-32 md:pb-20 md:pt-44">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="label mb-5 flex items-baseline gap-2.5 text-[11.5px]">
              <span className="status-dot shrink-0 -translate-y-px" />
              <span>
                {site.role} · {site.city}
              </span>
            </p>
            <KineticHeading className="mb-6 font-display text-[clamp(44px,7.4vw,92px)] font-[750] leading-[0.98] tracking-[-0.04em]">
              <span className="block">
                <ScrambleText text="Hello" /> <Greeting />,
              </span>
              <ScrambleText text={`meet ${site.firstName}.`} className="block" delay={120} />
            </KineticHeading>
            <p className="mb-7 max-w-[54ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted">
              {site.hero.intro}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="#work" className="btn btn-solid">
                [ View work ]
              </Link>
              <CopyEmailButton />
              <ResumeButton />
            </div>
          </div>
          <SpecCard />
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-y-4 border-t border-rule md:mt-20">
          {site.stats.map((s) => (
            <div key={s.label} className="pr-3.5 pt-3.5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-mono text-[11.5px] uppercase tracking-[.06em] text-muted">
                <b className="mb-1 block font-display text-[clamp(24px,2.6vw,32px)] font-bold normal-case leading-tight tracking-[-0.02em] text-ink">
                  {s.value}
                </b>
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
