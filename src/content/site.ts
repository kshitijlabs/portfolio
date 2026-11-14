// Everything a visitor reads about you lives in /src/content.

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a file in /public with the GitHub Pages base path (for plain <a> links). */
export const asset = (path: string) => `${BASE_PATH}${path}`;

export const site = {
  name: "Kshitij K",
  firstName: "Kshitij",
  initials: "kk", // shown in the wordmark as "kk/"
  handle: "kshitijlabs",
  role: "Senior .NET Full-Stack Engineer",
  city: "Nagpur, Maharashtra",
  cityShort: "Nagpur",
  region: "Maharashtra",
  country: "IN",
  // Status-bar clocks. Omit `label` to use the zone's own abbreviation (CST/CDT switches automatically).
  timeZones: [
    { tz: "Asia/Kolkata", label: "IST" },
    { tz: "America/Chicago" },
  ] as { tz: string; label?: string }[],
  email: "kolhe6.kshitij@gmail.com",
  // Public URL, used for SEO. The deploy workflow passes the exact GitHub Pages URL.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://kshitijlabs.github.io").replace(/\/$/, ""),
  availability: { open: true, label: "Available for work" },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kshitij-kolhe" },
    { label: "GitHub", href: "https://github.com/kshitijlabs" },
  ],
  // Google Drive share link (Share → General access → Anyone with the link → Viewer).
  // While this is null, every résumé button and link stays hidden.
  resumeUrl: "https://drive.google.com/drive/folders/1Gz2QtgU9_oc_-gnmnybk-R8RoJycESsQ?usp=sharing" as string | null,
  description:
    "Full-stack software engineer with 5+ years building secure, scalable enterprise applications in C#/.NET, React, SQL Server and Azure.",

  hero: {
    // Headline is "Hello @Model.Name, meet {firstName}." Send the link as /?to=Priya to greet someone by name.
    intro:
      "I build software that stays boring in production: fast pages, clean data, quiet on-call nights. Getting it there is the fun part.",
  },

  // Rendered as appsettings.Production.json in the hero
  spec: [
    ["Role", "Full-Stack Software Engineer"],
    ["Runtime", ".NET Core · C#"],
    ["Data", "SQL Server · MongoDB · Elasticsearch"],
    ["Frontend", "React · TypeScript · Next.js"],
    ["Cloud", "Azure · GitHub Actions"],
    ["AI", "Claude Code · Codex · Agents · RAG"],
    ["Experience", "5+ years"],
  ] as const,

  stats: [
    { value: "5+ yrs", label: "shipping .NET and React" },
    { value: "20+", label: "enterprise clients supported" },
  ],

  about: [
    {
      label: "Now",
      body: "Software engineer at Amla Commerce, building on the Znode B2B commerce platform. Technical lead on its largest catalog deployment, and on the hook for production incidents across 20+ enterprise clients.",
    },
    {
      label: "How I work",
      body: "Find the root cause, then fix it once. I instrument first (structured logs, API tracing, Application Insights), go down to the database when that is where the problem is, and ship through CI/CD so releases stay boring.",
    },
    {
      label: "Recognition",
      body: "Employee of the Year, FY 2022 and FY 2024.",
    },
    {
      label: "Education",
      body: "B.E. Electronics and Telecommunication, St. Vincent Pallotti College of Engineering and Technology, Nagpur, 2017–2021. CGPA 8.82.",
    },
  ],
};

export type Site = typeof site;
