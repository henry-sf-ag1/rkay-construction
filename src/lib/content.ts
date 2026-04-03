import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { siteConfig } from '@/config/site';
import type { SiteSettings, ServiceData, ProjectData, TestimonialData } from '@/types';

const reader = createReader(process.cwd(), keystaticConfig);

export async function getSiteSettings(): Promise<SiteSettings> {
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
      };
    }
  } catch (e) {
    console.error('Failed to read site settings from Keystatic:', e);
  }
  return {
    companyName: siteConfig.companyName,
    email: siteConfig.email,
    phone: siteConfig.phone,
    address: siteConfig.address,
    tagline: siteConfig.tagline,
    subtagline: siteConfig.subtagline,
    social: siteConfig.social,
    projectTypes: siteConfig.projectTypes,
  };
}

export async function getServices(): Promise<ServiceData[]> {
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
