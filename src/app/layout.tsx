import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { BootLoader } from "@/components/layout/BootLoader";
import { Navbar } from "@/components/layout/Navbar";
import { MobileDock } from "@/components/layout/MobileDock";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { Toaster } from "@/components/layout/Toaster";
import { CursorTrail } from "@/components/layout/CursorTrail";
import { PixelDino } from "@/components/layout/PixelDino";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", axes: ["opsz"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  // Absolute URLs: relative ones would drop a GitHub Pages project path (/repo).
  metadataBase: new URL(`${site.url}/`),
  title: { default: `${site.name} · ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, url: `${site.url}/` },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${site.url}/` },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efede7" },
    { media: "(prefers-color-scheme: dark)", color: "#12110f" },
  ],
  viewportFit: "cover",
};

// Runs before first paint:
// 1. restores the saved theme (light unless the visitor picked dark),
// 2. decides whether this browser session still needs the boot intro,
// 3. reads a personal greeting from ?to=Name (letters, spaces, . ' - only; max 24),
//    remembers it for the session and exposes it as <html data-visitor>.
const HEAD_SCRIPT = `(function(){var d=document.documentElement;
try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")d.setAttribute("data-theme",t)}catch(e){}
try{if(!sessionStorage.getItem("booted"))d.classList.add("booting")}catch(e){}
try{var s=sessionStorage,q=new URLSearchParams(location.search).get("to"),n=(q||s.getItem("visitor")||"").trim().replace(/\\s+/g," ");
if(n&&/^[\\p{L}\\p{M}' .-]{1,24}$/u.test(n)){s.setItem("visitor",n);d.setAttribute("data-visitor",n)}}catch(e){}
})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: site.socials.map((s) => s.href),
  address: {
    "@type": "PostalAddress",
    addressLocality: site.cityShort,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  knowsAbout: ["C#", ".NET", "ASP.NET Core", "SQL Server", "React", "TypeScript", "Microsoft Azure"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#work"
          className="sr-only z-[110] rounded bg-ink px-3 py-2 font-mono text-xs text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to work
        </a>
        <BootLoader />
        <Navbar />
        <main>{children}</main>
        <MobileDock />
        <CommandMenu />
        <PixelDino />
        <Toaster />
        <CursorTrail />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
