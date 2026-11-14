// Case studies, drafted from the résumé. Facts and numbers come from it directly;
// architecture diagrams are simplified views — review them for accuracy.
// Keep horizontal edge labels to ~10 characters: the gap between boxes is 70px.

export type ArchNode = {
  id: string;
  title: string;
  sub: string;
  col: number;
  row: number;
  /** Part of the main path (drawn in the accent colour). */
  hot?: boolean;
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
  hot?: boolean;
  dashed?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  scope: "Full-stack" | "Integration" | "AI" | "Automation" | "Performance" | "Security";
  kind: "Client" | "Internal";
  stack: string[];
  summary: string;
  /** 1–5, picks the preview colour until real screenshots exist */
  variant: 1 | 2 | 3 | 4 | 5;
  /** Optional screenshot in /public, e.g. "/work/catalog.webp" */
  image?: string;
  /** Label/value pairs shown under the title */
  facts: [string, string][];
  problem: string;
  architecture: {
    nodes: ArchNode[];
    edges: ArchEdge[];
    caption: string;
    /** What the animated packet carries along the accent path, and what comes back. */
    trace: { request: string; response: string };
  };
  decisions: { title: string; body: string }[];
  results: { value: string; before?: string; label: string }[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "catalog-go-live",
    title: "4.2M-SKU Catalog",
    scope: "Full-stack",
    kind: "Client",
    stack: [".NET Core", "React", "SQL Server", "Znode"],
    summary:
      "Technical lead for the largest catalog deployment on a multi-store Znode B2B commerce platform, and the fix that took product list pages from minutes to 6 seconds.",
    variant: 1,
    facts: [
      ["Role", "Technical lead"],
      ["Platform", "Znode B2B commerce, multi-store"],
      ["Scale", "4.2 million SKUs"],
      ["Stack", ".NET Core, React, SQL Server"],
    ],
    problem:
      "A multi-store B2B customer was bringing 4.2 million SKUs onto Znode, the largest catalog the platform had carried. The data model and imports had to hold at that size, and product list pages were taking minutes to load because the API fetched product fields the page never rendered.",
    architecture: {
      nodes: [
        { id: "store", title: "Storefronts", sub: "React · multi-store", col: 0, row: 0, hot: true },
        { id: "api", title: "Znode API", sub: ".NET Core", col: 1, row: 0, hot: true },
        { id: "sql", title: "SQL Server", sub: "catalog data model", col: 2, row: 0, hot: true },
        { id: "import", title: "Import orchestration", sub: "4.2M SKUs", col: 3, row: 0 },
      ],
      edges: [
        { from: "store", to: "api", label: "REST", hot: true },
        { from: "api", to: "sql", label: "lean query", hot: true },
        { from: "import", to: "sql", label: "bulk load" },
      ],
      caption: "Accent line = the path a shopper waits on. The speed-up came from trimming what the API fetched.",
      trace: { request: "GET /category/{id}/products", response: "200 OK · page in 6 s, was minutes" },
    },
    decisions: [
      {
        title: "Own the data model and the imports.",
        body: "As technical lead I owned catalog data modeling and import orchestration across a distributed multi-store .NET Core and React architecture.",
      },
      {
        title: "Fetch only what the page renders.",
        body: "Product list pages were over-fetching fields that were never displayed. Scoping the queries to rendered fields cut load times from minutes to 6 seconds.",
      },
    ],
    results: [
      { before: "minutes", value: "6 s", label: "product list page load" },
      { value: "4.2M", label: "SKUs live" },
      { value: "#1", label: "largest deployment on the platform" },
    ],
  },
  {
    slug: "multicart-order-recovery",
    title: "MultiCart Order Recovery",
    scope: "Integration",
    kind: "Client",
    stack: [".NET", "Znode", "TradeCentric"],
    summary:
      "Re-engineered the Znode ↔ TradeCentric MultiCart integration into a parallel multi-vendor flow, restoring the customer's highest-value order path.",
    variant: 2,
    facts: [
      ["Integration", "Znode ↔ TradeCentric MultiCart"],
      ["Order size", "$20K+ each"],
      ["Volume", "30–35 bulk orders a month"],
    ],
    problem:
      "The customer's highest-value orders were failing. 80% of bulk MultiCart orders arriving through TradeCentric were rejected, and each of those 30 to 35 orders a month was worth $20K or more.",
    architecture: {
      nodes: [
        { id: "buyer", title: "Buyer system", sub: "procurement", col: 0, row: 0, hot: true },
        { id: "tc", title: "TradeCentric", sub: "MultiCart", col: 1, row: 0, hot: true },
        { id: "int", title: "Znode integration", sub: ".NET · parallel flow", col: 2, row: 0, hot: true },
        { id: "orders", title: "Vendor orders", sub: "one per vendor", col: 3, row: 0, hot: true },
      ],
      edges: [
        { from: "buyer", to: "tc", label: "cart", hot: true },
        { from: "tc", to: "int", label: "MultiCart", hot: true },
        { from: "int", to: "orders", label: "parallel", hot: true },
      ],
      caption: "Each vendor's part of a cart is handled in its own parallel flow.",
      trace: { request: "POST multicart · 1 cart, many vendors", response: "one order per vendor, in parallel" },
    },
    decisions: [
      {
        title: "Re-engineer, don't patch.",
        body: "The integration was rebuilt as a parallel multi-vendor flow, so each vendor's items in a MultiCart order are processed on their own path.",
      },
      {
        title: "Protect the highest-value path first.",
        body: "These were the customer's largest orders, so the fix targeted the bulk order flow directly.",
      },
    ],
    results: [
      { value: "80%", label: "rejection rate resolved" },
      { value: "$20K+", label: "value of each bulk order" },
      { value: "30–35", label: "bulk orders a month" },
    ],
  },
  {
    slug: "ai-ticket-insights",
    title: "AI Ticket Insights",
    scope: "AI",
    kind: "Internal",
    stack: ["Python", "FastAPI", "React", "Gemini API", "RAG"],
    summary:
      "A company-wide AI platform that turns ticket data into root-cause analysis, resolution steps and key learnings, and remembers how similar issues were solved before.",
    variant: 4,
    facts: [
      ["Used by", "Product, launch and support teams"],
      ["Stack", "Python (FastAPI), React, Gemini API"],
      ["Sources", "Freshdesk API, Jira API"],
      ["Memory", "RAG over closed tickets and past searches"],
    ],
    problem:
      "Ticket history sat in Freshdesk and Jira, and triage depended on who picked a ticket up. The same issues kept coming back, and the fix from last time was buried in an old ticket that nobody remembered.",
    architecture: {
      nodes: [
        { id: "ui", title: "React app", sub: "teams' dashboard", col: 0, row: 0, hot: true },
        { id: "api", title: "FastAPI service", sub: "Python", col: 1, row: 0, hot: true },
        { id: "kb", title: "Knowledge store", sub: "RAG · past cases", col: 2, row: 0, hot: true },
        { id: "llm", title: "Gemini API", sub: "RCA · steps · learnings", col: 3, row: 0, hot: true },
        { id: "fd", title: "Freshdesk API", sub: "tickets", col: 1, row: 1 },
        { id: "jira", title: "Jira API", sub: "issues", col: 2, row: 1 },
      ],
      edges: [
        { from: "ui", to: "api", label: "REST", hot: true },
        { from: "api", to: "kb", label: "similar?", hot: true },
        { from: "kb", to: "llm", label: "+ context", hot: true },
        { from: "api", to: "fd", label: "fetch" },
        { from: "api", to: "jira", label: "fetch" },
      ],
      caption:
        "Before the model answers, the service retrieves similar closed tickets and past searches, so the analysis starts from what already worked.",
      trace: { request: "POST /tickets/{id}/insights", response: "RCA · steps · learnings, plus similar past cases" },
    },
    decisions: [
      {
        title: "Give the model a memory.",
        body: "Closed tickets and earlier searches are stored and retrieved (RAG), so when an issue looks like one solved before, the AI agent sees that case and its fix as context instead of starting from zero.",
      },
      {
        title: "Three outputs per ticket.",
        body: "Every analysis returns a root cause, resolution steps and key learnings, so answers look the same no matter who asks.",
      },
      {
        title: "Use the systems teams already work in.",
        body: "Data comes straight from the Freshdesk and Jira APIs, so nobody has to copy tickets anywhere.",
      },
    ],
    results: [
      { value: "3", label: "teams using it company-wide" },
      { value: "2", label: "ticket sources connected" },
      { value: "3", label: "outputs per ticket" },
    ],
  },
  {
    slug: "incident-tracker",
    title: "Incident Tracker",
    scope: "Automation",
    kind: "Internal",
    stack: ["Site24x7", "New Relic", "Jira", "AI RCA"],
    summary:
      "Monitoring alerts become Jira tickets automatically, with an agent dashboard, uptime reporting and an AI-powered RCA panel.",
    variant: 5,
    facts: [
      ["Alerts from", "Site24x7, New Relic"],
      ["Tickets in", "Jira"],
      ["For", "Support agents"],
    ],
    problem:
      "Alerts from Site24x7 and New Relic had to be turned into Jira tickets by hand, which slowed down incident response.",
    architecture: {
      nodes: [
        { id: "mon", title: "Site24x7 · New Relic", sub: "monitoring alerts", col: 0, row: 0, hot: true },
        { id: "app", title: "Incident Tracker", sub: "web app", col: 1, row: 0, hot: true },
        { id: "jira", title: "Jira", sub: "auto-created tickets", col: 2, row: 0, hot: true },
        { id: "dash", title: "Agent dashboard", sub: "uptime · AI RCA", col: 1, row: 1 },
      ],
      edges: [
        { from: "mon", to: "app", label: "alert", hot: true },
        { from: "app", to: "jira", label: "create", hot: true },
        { from: "app", to: "dash", label: "report" },
      ],
      caption: "An alert reaches Jira without anyone retyping it.",
      trace: { request: "ALERT site down · Site24x7", response: "Jira ticket created, nobody retyped it" },
    },
    decisions: [
      {
        title: "Automate the hand-off.",
        body: "Monitoring alerts are integrated with the web application and create Jira tickets automatically.",
      },
      {
        title: "Give agents one screen.",
        body: "A dashboard combines uptime reporting with an AI-powered RCA panel.",
      },
    ],
    results: [{ value: "−60%", label: "manual ticket-creation time" }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
