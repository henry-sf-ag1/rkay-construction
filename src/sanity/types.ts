// Shared types for Sanity CMS data

export interface SiteSettings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  tagline: string;
  subtagline: string;
  logo?: SanityImage;
  about: {
    intro: string;
    values: { title: string; description: string }[];
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  projectTypes?: string[];
}

export interface ServiceData {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ProjectData {
  _id: string;
  title: string;
  description: string;
  location: string;
  image?: SanityImage & { alt?: string };
  order: number;
}

export interface TestimonialData {
  _id: string;
  name: string;
  location: string;
  quote: string;
  order: number;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}
