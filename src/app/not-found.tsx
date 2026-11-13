import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80dvh] flex-col justify-center pb-24 pt-36">
      <p className="label mb-4">HTTP 404 · Not Found</p>
      <h1 className="mb-6 font-display text-[clamp(40px,7vw,84px)] font-[750] leading-[0.96] tracking-[-0.04em]">
        No route matches <span className="text-accent">this URL.</span>
      </h1>
      <pre className="mb-8 max-w-full overflow-x-auto rounded-md bg-term p-4 font-mono text-xs leading-relaxed text-term-ink">
        <span className="text-term-dim">fail:</span> Microsoft.AspNetCore.Routing[0]{"\n"}
        {"      "}No endpoint matched the request path.
      </pre>
      <div>
        <Link href="/" className="btn btn-solid">
          [ Back to the homepage ]
        </Link>
      </div>
    </section>
  );
}
