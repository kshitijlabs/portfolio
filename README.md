# kshitijlabs portfolio

Personal portfolio of Kshitij K, Senior .NET Full-Stack Engineer.
Next.js (static export) · TypeScript · Tailwind CSS · Motion · hosted on GitHub Pages.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

The boot intro plays once per browser tab. To see it again, open a new tab
or run `sessionStorage.clear()` in the browser console and refresh.

## Edit content

Everything visitors read is in `src/content/`:

| File | What it holds |
|---|---|
| `site.ts` | Name, contact, hero text, stats, About |
| `projects.ts` | Case studies and their architecture diagrams |
| `career.ts` | Stack, experience, FAQ |

Project screenshots go in `public/work/` and are referenced with `image: "/work/name.webp"`.
To show the résumé link, add `public/resume.pdf` and set `resumeUrl: asset("/resume.pdf")` in `site.ts`.

## Deploy to GitHub Pages

1. Create a public repository on GitHub. Name it **`kshitijlabs.github.io`** to get
   `https://kshitijlabs.github.io`, or use any name to get `https://kshitijlabs.github.io/<name>`.
   The build adapts to either automatically.
2. Push the contents of this folder to the repository's `main` branch.
3. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
   Watch it under the **Actions** tab; the live URL appears on the finished run.
