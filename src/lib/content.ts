import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { siteConfig } from '@/config/site';
import type { SiteSettings, ServiceData, ProjectData, TestimonialData } from '@/types';

const reader = createReader(process.cwd(), keystaticConfig);

const BLOB_KEY = 'site-config.json';

async function getSettingsFromBlob(): Promise<Partial<SiteSettings> | null> {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) return null;
    const { head } = await import('@vercel/blob');
    try {
      const blobMeta = await head(BLOB_KEY);
      if (!blobMeta?.url) return null;
      const cacheBust = `${blobMeta.url}${blobMeta.url.includes('?') ? '&' : '?'}t=${Date.now()}`;
      const res = await fetch(cacheBust, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  } catch (e) {
    console.error('Failed to read site settings from Vercel Blob:', e);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  // 1. Try Vercel Blob (fastest — near-instant updates)
  const blobSettings = await getSettingsFromBlob();
  if (blobSettings) {
    return {
      companyName: blobSettings.companyName || siteConfig.companyName,
      email: blobSettings.email || siteConfig.email,
      phone: blobSettings.phone || siteConfig.phone,
      address: blobSettings.address || siteConfig.address,
      tagline: blobSettings.tagline || siteConfig.tagline,
      subtagline: blobSettings.subtagline || siteConfig.subtagline,
      social: blobSettings.social || siteConfig.social,
      projectTypes: blobSettings.projectTypes?.length ? blobSettings.projectTypes : siteConfig.projectTypes,
      theme: (blobSettings as any).theme || siteConfig.theme,
      quoteForm: (blobSettings as any).quoteForm || siteConfig.quoteForm,
      sectionSubtitles: (blobSettings as any).sectionSubtitles || siteConfig.sectionSubtitles,
      about: (blobSettings as any).about || siteConfig.about,
      services: (blobSettings as any).services || siteConfig.services,
      projects: (blobSettings as any).projects || siteConfig.projects,
      testimonials: (blobSettings as any).testimonials || siteConfig.testimonials,
      heroImage: (blobSettings as any).heroImage || null,
    } as SiteSettings;
  }

  // 2. Fall back to Keystatic file reader
  try {
    const settings = await reader.singletons.siteSettings.read();
    if (settings) {
      return {
        companyName: settings.companyName || siteConfig.companyName,
        email: settings.email || siteConfig.email,
        phone: settings.phone || siteConfig.phone,
        address: settings.address || siteConfig.address,
        tagline: settings.tagline || siteConfig.tagline,
        subtagline: settings.subtagline || siteConfig.subtagline,
        social: {
          facebook: settings.social?.facebook || siteConfig.social.facebook,
          instagram: settings.social?.instagram || siteConfig.social.instagram,
          linkedin: settings.social?.linkedin || siteConfig.social.linkedin,
        },
        projectTypes: settings.projectTypes?.length ? [...settings.projectTypes] : siteConfig.projectTypes,
        theme: siteConfig.theme,
        quoteForm: siteConfig.quoteForm,
        sectionSubtitles: siteConfig.sectionSubtitles,
      };
    }
  } catch (e) {
    console.error('Failed to read site settings from Keystatic:', e);
  }

  // 3. Static fallback
  return {
    companyName: siteConfig.companyName,
    email: siteConfig.email,
    phone: siteConfig.phone,
    address: siteConfig.address,
    tagline: siteConfig.tagline,
    subtagline: siteConfig.subtagline,
    social: siteConfig.social,
    projectTypes: siteConfig.projectTypes,
    theme: siteConfig.theme,
    quoteForm: siteConfig.quoteForm,
    sectionSubtitles: siteConfig.sectionSubtitles,
  };
}

export async function getServices(): Promise<ServiceData[]> {
  // Try blob first
  const blob = await getSettingsFromBlob();
  if (blob && (blob as any).services?.length) {
    return (blob as any).services.map((s: any, i: number) => ({
      slug: `blob-${i}`,
      title: s.title || '',
      description: s.description || '',
      icon: s.icon || '',
      order: i,
    }));
  }
  // Fall back to Keystatic
  try {
    const slugs = await reader.collections.services.list();
    const items = await Promise.all(
      slugs.map(async (slug) => {
        const entry = await reader.collections.services.read(slug);
        if (!entry) return null;
        return {
          slug,
          title: (typeof entry.title === 'object' ? (entry.title as any).name : entry.title) || slug,
          description: entry.description || '',
          icon: entry.icon || '',
          order: entry.order ?? 0,
        } satisfies ServiceData;
      })
    );
    const filtered = items.filter(Boolean) as ServiceData[];
    if (filtered.length > 0) {
      return filtered.sort((a, b) => a.order - b.order);
    }
  } catch (e) {
    console.error('Failed to read services from Keystatic:', e);
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
  // Try blob first
  const blob = await getSettingsFromBlob();
  if (blob && (blob as any).projects?.length) {
    return (blob as any).projects.map((p: any, i: number) => ({
      slug: `blob-${i}`,
      title: p.title || '',
      description: p.description || '',
      location: p.location || 'UK',
      image: p.image || null,
      order: i,
    }));
  }
  // Fall back to Keystatic
  try {
    const slugs = await reader.collections.projects.list();
    const items = await Promise.all(
      slugs.map(async (slug) => {
        const entry = await reader.collections.projects.read(slug);
        if (!entry) return null;
        return {
          slug,
          title: (typeof entry.title === 'object' ? (entry.title as any).name : entry.title) || slug,
          description: entry.description || '',
          location: entry.location || 'UK',
          image: typeof entry.image === 'string' ? entry.image : (entry.image as any)?.src || null,
          order: entry.order ?? 0,
        } satisfies ProjectData;
      })
    );
    const filtered = items.filter(Boolean) as ProjectData[];
    if (filtered.length > 0) {
      return filtered.sort((a, b) => a.order - b.order);
    }
  } catch (e) {
    console.error('Failed to read projects from Keystatic:', e);
  }
  return siteConfig.projects.map((p, i) => ({
    slug: `static-${i}`,
    title: p.title,
    description: p.description,
    location: p.title.split('—')[1]?.trim() || 'UK',
    image: (p as any).image || null,
    order: i,
  }));
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  // Try blob first
  const blob = await getSettingsFromBlob();
  if (blob && (blob as any).testimonials?.length) {
    return (blob as any).testimonials.map((t: any, i: number) => ({
      slug: `blob-${i}`,
      name: t.name || '',
      location: t.location || '',
      quote: t.quote || '',
      order: i,
    }));
  }
  // Fall back to Keystatic
  try {
    const slugs = await reader.collections.testimonials.list();
    const items = await Promise.all(
      slugs.map(async (slug) => {
        const entry = await reader.collections.testimonials.read(slug);
        if (!entry) return null;
        return {
          slug,
          name: (typeof entry.name === 'object' ? (entry.name as any).name : entry.name) || slug,
          location: entry.location || '',
          quote: entry.quote || '',
          order: entry.order ?? 0,
        } satisfies TestimonialData;
      })
    );
    const filtered = items.filter(Boolean) as TestimonialData[];
    if (filtered.length > 0) {
      return filtered.sort((a, b) => a.order - b.order);
    }
  } catch (e) {
    console.error('Failed to read testimonials from Keystatic:', e);
  }
  return siteConfig.testimonials.map((t, i) => ({
    slug: `static-${i}`,
    name: t.name,
    location: t.location,
    quote: t.quote,
    order: i,
  }));
}
