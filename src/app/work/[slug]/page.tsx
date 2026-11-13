import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { ArchitectureDiagram } from "@/components/ui/ArchitectureDiagram";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `${site.url}/work/${project.slug}/` },
    openGraph: { title: project.title, description: project.summary, url: `${site.url}/work/${project.slug}/` },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="reveal grid gap-4 border-b border-rule py-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8 md:py-10">
      <h2 className="label pt-1">{label}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="container-x pb-32 pt-32 md:pb-24 md:pt-40">
      <p className="label mb-3">
        <Link href="/#work" className="hover:text-accent">
          Work
        </Link>{" "}
        / {String(index + 1).padStart(2, "0")} · {project.scope} · {project.kind === "Client" ? "Client project" : "Internal tool"}
      </p>
      <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
        <h1 className="mb-4 font-display text-[clamp(40px,6vw,76px)] font-[750] leading-[0.98] tracking-[-0.04em]">
          {project.title}
        </h1>
      </ViewTransition>
      <p className="mb-8 max-w-[60ch] text-[clamp(15px,1.5vw,18px)] leading-relaxed text-muted">{project.summary}</p>

      <dl className="grid grid-cols-2 border-b border-t border-b-rule border-t-ink md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {project.facts.map(([k, v]) => (
          <div key={k} className="min-w-0 py-3.5 pr-4 text-sm">
            <dt className="label mb-1">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <Block label="The problem">
        <p className="max-w-[64ch] leading-relaxed">{project.problem}</p>
      </Block>

      <Block label="Architecture">
        <ArchitectureDiagram
          id={project.slug}
          nodes={project.architecture.nodes}
          edges={project.architecture.edges}
          trace={project.architecture.trace}
          label={`Architecture of ${project.title}: ${project.architecture.nodes.map((n) => n.title).join(", ")}.`}
        />
        <p className="mt-3 font-mono text-[11.5px] text-muted">{project.architecture.caption}</p>
      </Block>

      <Block label="Key decisions">
        <ol className="grid gap-4">
          {project.decisions.map((d, i) => (
            <li key={d.title} className="grid grid-cols-[3ch_minmax(0,1fr)] gap-3">
              <span className="font-mono text-xs font-bold leading-[1.9] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="max-w-[64ch] leading-relaxed">
                <b className="font-semibold">{d.title}</b> {d.body}
              </p>
            </li>
          ))}
        </ol>
      </Block>

      <Block label="Results">
        <dl className="grid gap-3 sm:grid-cols-3">
          {project.results.map((r) => (
            <div key={r.label} className="rounded-lg border border-rule bg-card px-4 py-3.5">
              <dd className="font-display text-[clamp(28px,3.4vw,40px)] font-[750] leading-tight tracking-[-0.03em] tabular-nums">
                {r.before && (
                  <s className="mr-1.5 text-[0.6em] font-medium text-muted decoration-1">{r.before}</s>
                )}
                {r.value}
              </dd>
              <dt className="label">{r.label}</dt>
            </div>
          ))}
        </dl>
        {project.links && project.links.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[.07em]">
            {project.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="border-b border-rule hover:text-accent">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </Block>

      <Link
        href={`/work/${next.slug}`}
        prefetch={false} // see WorkList: dynamic-route segment prefetch 404s under static export
        className="group flex flex-wrap items-baseline justify-between gap-4 pt-10"
      >
        <span className="label">Next project</span>
        <ViewTransition name={`title-${next.slug}`} share="morph" default="none">
          <span className="font-display text-[clamp(24px,3vw,38px)] font-bold tracking-[-0.03em] group-hover:text-accent">
            {next.title} →
          </span>
        </ViewTransition>
      </Link>
    </article>
  );
}
