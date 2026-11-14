// Career content, from the résumé.

export const stackGroups = [
  {
    title: "Backend",
    tag: ".NET",
    items: ["C# · .NET Core · .NET MVC", "Entity Framework Core · LINQ", "Razor Pages", "REST · GraphQL APIs"],
  },
  {
    title: "Data & Search",
    tag: "SQL",
    items: ["Microsoft SQL Server", "MongoDB", "Elasticsearch", "HawkSearch"],
  },
  {
    title: "Frontend",
    tag: "React",
    items: ["React · TypeScript", "Next.js", "Node.js", "HTML5 · CSS3"],
  },
  {
    title: "Cloud & DevOps",
    tag: "Azure",
    items: ["Azure · Key Vault", "Application Insights · New Relic", "GitHub Actions · CI/CD", "Docker · Kubernetes"],
  },
  {
    title: "Architecture",
    tag: "Design",
    items: ["Microservices · distributed systems", "OAuth 2.0 · JWT · API security", "SOLID · design patterns", "TDD · unit & integration tests"],
  },
  {
    title: "AI",
    tag: "Agents",
    items: [
      "Claude Code · Codex · GitHub Copilot",
      "AI agents · tool calling · agentic workflows",
      "RAG · embeddings · vector search",
      "LLM APIs (Gemini) · prompt engineering",
    ],
  },
] as const;

// Kept to one line per job on purpose: the details live in the résumé (site.resumeUrl).
export const experience = [
  {
    years: "2021 – now",
    company: "Amla Commerce",
    role: "Software Engineer",
    summary:
      "Building and running enterprise B2B commerce end to end: .NET APIs, React storefronts, SQL Server and Azure, from first commit to production support.",
  },
  {
    years: "Jun 2020",
    company: "Cojag Smart Technology",
    role: "Intern",
    summary: "Built a responsive web app that brought study material together in one place for students.",
  },
];

export const faq = [
  {
    q: "Backend or frontend?",
    a: "Both. I usually start at the schema and finish at the loading state of the button.",
  },
  {
    q: "Which .NET?",
    a: "Whatever runs in production. Mostly .NET Core and .NET MVC with Entity Framework Core, on a multi-store commerce platform.",
  },
  {
    q: "Do you write SQL by hand?",
    a: "Yes. EF Core and LINQ for most things, and SQL Server directly when a query plan or a production incident needs it.",
  },
  {
    q: "Do you use AI tools?",
    a: "Every day, on both sides. Claude Code and Codex as coding agents, Copilot in the editor. And inside what I build: RAG over real company data and LLM-backed tools like AI Ticket Insights.",
  },
];
