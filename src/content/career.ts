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
    tag: "Gen AI",
    items: ["LLM API integration (Gemini)", "Prompt engineering", "GitHub Copilot", "Claude Code"],
  },
] as const;

export const experience = [
  {
    years: "2021 – now",
    company: "Amla Commerce",
    role: "Software Engineer",
    points: [
      "Technical lead for the 4.2M-SKU catalog go-live, the Znode platform's largest deployment; cut product list pages from minutes to 6 seconds.",
      "Restored the customer's highest-value order path by re-engineering the TradeCentric MultiCart integration, resolving an 80% rejection rate on $20K+ bulk orders.",
      "Closed an unrestricted file-upload vulnerability in the PO document endpoint with allowlist-based validation.",
      "Shipped HawkSearch REST APIs in Znode v9x (90% client adoption) and an Epicor CPQ Vision integration with a 3D in-browser configurator.",
      "Built the inventory and pricing sync between a 40K-SKU catalog and four ERPs, and collapsed a 4-hour weekly job plus a nightly delta into one 45-minute pipeline.",
      "Own production observability for about 2 P1 incidents a week across 20+ enterprise clients: structured logging, API tracing, Application Insights and New Relic, database-level RCA.",
      "Built GitHub Actions CI/CD across Dev, Stage and Production for two customer projects, with no rollback-triggering deployments. Mentored 5+ engineers through code review.",
    ],
    tags: [".NET Core", "React", "SQL Server", "Azure", "Znode", "GitHub Actions", "Employee of the Year ×2"],
  },
  {
    years: "Jun 2020",
    company: "Cojag Smart Technology",
    role: "Intern",
    points: [
      "Built a responsive web app that gathered IIT entrance-prep material in one place for 50+ students, improving access to resources by 40%.",
    ],
    tags: ["HTML", "CSS", "Bootstrap"],
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
    a: "Every day. GitHub Copilot and Claude Code while coding, and the Gemini API inside tools I build, like AI Ticket Insights.",
  },
];
