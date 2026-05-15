import { siteConfig } from '@/config/site';
import type { SiteSettings, ServiceData, ProjectData, TestimonialData } from '@/types';

const REPO = 'henry-sf-ag1/rkay-construction';
const CONFIG_PATH = 'content/site-config.json';
const BRANCH = 'master';

// Fetch live config from GitHub — works at runtime without a rebuild.
// All pages are dynamic (server-rendered on demand), so this runs per request.
// Uses a short revalidation so Vercel's data cache doesn't stale it.
async function getLiveConfig(): Promise<any | null> {
  const pat = process.env.GITHUB_PAT;
  if (!pat) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${CONFIG_PATH}?ref=${BRANCH}`,
      {
        headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 15 }, // cache for 15s to avoid hammering GitHub API
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
  } catch (e) {
    console.error('Failed to fetch live config:', e);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const live = await getLiveConfig();
  const base = live || siteConfig;

  return {
    companyName: base.companyName || siteConfig.companyName,
    email: base.email || siteConfig.email,
    phone: base.phone || siteConfig.phone,
    address: base.address || siteConfig.address,
    tagline: base.tagline || siteConfig.tagline,
    subtagline: base.subtagline || siteConfig.subtagline,
    social: { ...siteConfig.social, ...(base.social || {}) },
    projectTypes: base.projectTypes?.length ? base.projectTypes : siteConfig.projectTypes,
    theme: { ...(siteConfig as any).theme, ...(base.theme || {}) },
    quoteForm: { ...(siteConfig as any).quoteForm, ...(base.quoteForm || {}) },
    sectionSubtitles: { ...(siteConfig as any).sectionSubtitles, ...(base.sectionSubtitles || {}) },
    about: base.about || (siteConfig as any).about,
    services: base.services || (siteConfig as any).services,
    projects: base.projects || (siteConfig as any).projects,
    testimonials: base.testimonials || (siteConfig as any).testimonials,
    heroImage: base.heroImage || null,
  } as SiteSettings;
}

export async function getServices(): Promise<ServiceData[]> {
  const live = await getLiveConfig();
  const services = live?.services || (siteConfig as any).services;
  if (services?.length) {
    return services.map((s: any, i: number) => ({
      slug: `cfg-${i}`,
      title: s.title || '',
      description: s.description || '',
      icon: s.icon || '',
      order: i,
    }));
  }
  return siteConfig.services.map((s, i) => ({
    slug: `static-${i}`,
    title: s.title,
    description: s.description,
    icon: '',
    order: i,
  }));
}

export async function getProjects(): Promise<ProjectData[]> {
  const live = await getLiveConfig();
  const projects = live?.projects || (siteConfig as any).projects;
  if (projects?.length) {
    return projects.map((p: any, i: number) => ({
      slug: `cfg-${i}`,
      title: p.title || '',
      description: p.description || '',
      location: p.location || p.title?.split('—')[1]?.trim() || 'UK',
      image: p.image || null,
      order: i,
    }));
  }
  return siteConfig.projects.map((p, i) => ({
    slug: `static-${i}`,
    title: p.title,
    description: p.description,
    location: (p as any).location || p.title.split('—')[1]?.trim() || 'UK',
    image: (p as any).image || null,
    order: i,
  }));
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  const live = await getLiveConfig();
  const testimonials = live?.testimonials || (siteConfig as any).testimonials;
  if (testimonials?.length) {
    return testimonials.map((t: any, i: number) => ({
      slug: `cfg-${i}`,
      name: t.name || '',
      location: t.location || '',
      quote: t.quote || '',
      order: i,
    }));
  }
  return siteConfig.testimonials.map((t, i) => ({
    slug: `static-${i}`,
    name: t.name,
    location: t.location,
    quote: t.quote,
    order: i,
  }));
}
