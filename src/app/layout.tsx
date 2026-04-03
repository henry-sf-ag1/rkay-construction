import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/content";

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

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const theme = (settings as any).theme || {
    primaryColor: '#1e293b',
    accentColor: '#d4a853',
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    lightTextColor: '#64748b',
  };
  const cssVars = `
    :root {
      --color-primary: ${theme.primaryColor};
      --color-accent: ${theme.accentColor};
      --color-background: ${theme.backgroundColor};
      --color-text: ${theme.textColor};
      --color-text-light: ${theme.lightTextColor};
      --color-heading: ${theme.headingColor || theme.primaryColor};
      --color-about-text: ${theme.aboutTextColor || theme.textColor};
      --color-services-text: ${theme.servicesTextColor || theme.textColor};
      --color-projects-text: ${theme.projectsTextColor || theme.textColor};
      --color-testimonials-text: ${theme.testimonialsTextColor || theme.textColor};
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
