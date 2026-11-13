import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { experience, faq, stackGroups } from "@/content/career";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { StatusBar } from "@/components/layout/StatusBar";
import { WorkList } from "./WorkList";

const section = "container-x scroll-mt-24 py-20 md:py-28";

/** Pixel-art Claude Code mascot; hops when the footer line is hovered. */
function ClaudeCodeMark() {
  return (
    <svg
      viewBox="0 0 16 10"
      role="img"
      aria-label="Claude Code"
      shapeRendering="crispEdges"
      className="inline-block h-[0.85em] w-[1.36em] align-[-0.05em] transition-transform duration-300 ease-out group-hover:-translate-y-[3px]"
    >
      <title>Claude Code</title>
      <path
        fill="#D97757"
        fillRule="evenodd"
        d="M2 0H14V4H16V6H14V8H13V10H12V8H11V10H10V8H6V10H5V8H4V10H3V8H2V6H0V4H2ZM4 2V4H5V2ZM11 2V4H12V2Z"
      />
    </svg>
  );
}

export function Work() {
  return (
    <section id="work" className={section}>
      <SectionHeader index="001" title="Selected work" meta={`${projects.length} projects · 2021–now`} />
      <WorkList
        projects={projects.map(({ slug, title, scope, kind, stack, variant, image }) => ({
          slug,
          title,
          scope,
          kind,
          stack,
          variant,
          image,
        }))}
      />
    </section>
  );
}

export function About() {
  return (
    <section id="about" className={section}>
      <SectionHeader index="002" title="About" meta={site.city} />
      <dl className="reveal">
        {site.about.map((row) => (
          <div
            key={row.label}
            className="grid gap-2 border-t border-rule py-5 first:border-t-0 md:grid-cols-[200px_minmax(0,1fr)] md:gap-x-8"
          >
            <dt className="label pt-1">{row.label}</dt>
            <dd className="max-w-[62ch] text-[16px] leading-relaxed">{row.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Stack() {
  return (
    <section id="stack" className={section}>
      <SectionHeader index="003" title="Stack" meta="Grouped by layer" />
      <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:[&:has(>div:hover)>div:not(:hover)]:opacity-40">
        {stackGroups.map((g) => (
          <div key={g.title} className="reveal transition-opacity duration-300">
            <h3 className="mb-2.5 flex justify-between font-mono text-[11px] font-bold uppercase tracking-[.09em]">
              {g.title} <span className="font-medium text-muted">{g.tag}</span>
            </h3>
            <ul>
              {g.items.map((name) => (
                <li key={name} className="border-b border-rule/70 py-2 font-mono text-[12.5px]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className={section}>
      <SectionHeader index="004" title="Experience" meta="Open a row for details" />
      <div className="reveal">
        {experience.map((job, i) => (
          <details key={job.company} open={i === 0} className="group border-b border-rule">
            <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_24px] items-baseline gap-x-4 gap-y-0.5 py-5 md:grid-cols-[130px_minmax(0,1fr)_minmax(0,1fr)_24px] [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-xs tabular-nums text-muted">{job.years}</span>
              <span className="col-start-1 font-display text-[clamp(20px,2.2vw,25px)] font-bold leading-tight tracking-[-0.02em] md:col-auto">
                {job.company}
              </span>
              <span className="col-start-1 text-sm text-muted md:col-auto">{job.role}</span>
              <span
                aria-hidden="true"
                className="col-start-2 row-span-3 row-start-1 self-center text-right font-mono text-base text-muted transition-transform group-open:rotate-45 group-open:text-accent md:col-auto md:row-auto"
              >
                +
              </span>
            </summary>
            <div className="pb-6 md:pl-[146px]">
              <ul className="max-w-[70ch] list-disc space-y-1 pl-5 text-sm text-muted marker:text-rule">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
                {job.tags.map((t) => (
                  <li key={t} className="rounded-full border border-rule px-2.5 py-0.5 font-mono text-[10.5px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-[minmax(0,.8fr)_minmax(0,2fr)]">
        <h3 className="font-display text-[clamp(38px,5vw,62px)] font-[750] leading-[0.95] tracking-[-0.04em]">
          Before you <span className="text-accent">ask.</span>
        </h3>
        <dl className="reveal grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {faq.map((item, i) => (
            <div key={item.q}>
              <span className="label text-accent">Q.{String(i + 1).padStart(2, "0")}</span>
              <dt className="mb-1.5 mt-1.5 font-display text-lg font-bold leading-snug tracking-[-0.01em]">{item.q}</dt>
              <dd className="text-sm leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className={`${section} pb-32 md:pb-16`}>
      <SectionHeader index="005" title="Contact" meta="Replies within a day" />
      <h2 className="mb-8 mt-6 max-w-[16ch] font-display text-[clamp(38px,6.4vw,82px)] font-[750] leading-[0.96] tracking-[-0.04em]">
        Have a system that needs to hold up?
      </h2>
      <div className="flex flex-wrap items-center gap-4 border-b border-t border-b-rule border-t-ink py-5">
        <a
          href={`mailto:${site.email}`}
          className="break-all font-mono text-[clamp(19px,3.4vw,40px)] font-medium tracking-[-0.02em] hover:text-accent"
        >
          {site.email}
        </a>
        <CopyEmailButton label="[ Copy ]" solid />
      </div>
      <ul className="mb-12 mt-5 flex flex-wrap gap-6 font-mono text-xs font-medium uppercase tracking-[.07em]">
        {site.socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-rule pb-0.5 hover:border-accent hover:text-accent"
            >
              {s.label} ↗
            </a>
          </li>
        ))}
        {site.resumeUrl && (
          <li>
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noopener"
              className="border-b border-rule pb-0.5 hover:border-accent hover:text-accent"
            >
              Résumé PDF ↗
            </a>
          </li>
        )}
      </ul>
      <StatusBar />
      <p className="mt-6 flex flex-wrap justify-between gap-3 font-mono text-[11px] uppercase tracking-[.08em] text-muted">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="group">
          Handmade with{" "}
          <span role="img" aria-label="heart">
            🫀
          </span>{" "}
          and{" "}
          <span role="img" aria-label="brain">
            🧠
          </span>{" "}
          and <ClaudeCodeMark />
        </span>
      </p>
    </section>
  );
}
