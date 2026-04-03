import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyName,
    email,
    phone,
    address,
    tagline,
    subtagline,
    logo,
    about {
      intro,
      values[] {
        title,
        description
      }
    },
    social {
      facebook,
      instagram,
      linkedin
    },
    projectTypes
  }
`;

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    description,
    icon,
    order
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    description,
    location,
    image {
      ...,
      alt
    },
    order
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    name,
    location,
    quote,
    order
  }
`;
