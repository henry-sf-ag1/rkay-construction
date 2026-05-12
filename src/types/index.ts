// Shared types for CMS data

export interface Theme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  lightTextColor: string;
}

export interface FormField {
  label: string;
  placeholder?: string;
  required: boolean;
  show: boolean;
}

export interface QuoteFormConfig {
  title: string;
  subtitle: string;
  successMessage: string;
  projectTypes: string[];
  buttonText: string;
  showFileUpload: boolean;
  fields: Record<string, FormField>;
}

export interface SectionSubtitles {
  ourWork: string;
  services: string;
}

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
  theme: Theme;
  quoteForm: QuoteFormConfig;
  sectionSubtitles: SectionSubtitles;
  about?: {
    intro: string;
    values: Array<{ title: string; description: string }>;
  };
  services?: Array<{ title: string; description: string }>;
  projects?: Array<{ title: string; description: string; location?: string; image?: string }>;
  testimonials?: Array<{ name: string; location: string; quote: string }>;
  heroImage?: string | null;
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
