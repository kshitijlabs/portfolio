/** Mono section label row: "001 / Selected work ............ meta". */
export function SectionHeader({ index, title, meta }: { index: string; title: string; meta?: string }) {
  return (
    <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-3.5">
      <h2 className="label">
        <b className="font-bold text-accent">{index}</b> / {title}
      </h2>
      {meta && <p className="label">{meta}</p>}
    </div>
  );
}
