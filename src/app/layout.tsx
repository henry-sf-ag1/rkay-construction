import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "R Kay Construction | Quality Residential Building",
  description:
    "R Kay Construction — Quality residential construction across the UK. Extensions, renovations, new builds, and loft conversions. Get a free quote today.",
  keywords:
    "construction, residential building, house extensions, loft conversions, new builds, renovations, UK builder",
  openGraph: {
    title: "R Kay Construction | Quality Residential Building",
    description:
      "Quality residential construction across the UK. Extensions, renovations, new builds, and loft conversions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = siteConfig;
  const cssVars = `
    :root {
      --color-primary: ${theme.primaryColor};
      --color-accent: ${theme.accentColor};
      --color-background: ${theme.backgroundColor};
      --color-text: ${theme.textColor};
      --color-text-light: ${theme.lightTextColor};
    }
  `;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
