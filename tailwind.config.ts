import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        "site-bg": "var(--color-background)",
        "site-text": "var(--color-text)",
        "site-text-light": "var(--color-text-light)",
        heading: "var(--color-heading)",
        "about-text": "var(--color-about-text)",
        "services-text": "var(--color-services-text)",
        "projects-text": "var(--color-projects-text)",
        "testimonials-text": "var(--color-testimonials-text)",
        "light-grey": "#F5F5F5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
