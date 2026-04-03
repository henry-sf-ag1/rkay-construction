// Shared types for CMS data

export interface SiteSettings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  tagline: string;
  subtagline: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  projectTypes: string[];
}

export interface ServiceData {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ProjectData {
  slug: string;
  title: string;
  description: string;
  location: string;
  image?: string | null;
  order: number;
}

export interface TestimonialData {
  slug: string;
  name: string;
  location: string;
  quote: string;
  order: number;
}
