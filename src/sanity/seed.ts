/**
 * Seed script to populate Sanity with content from src/config/site.ts
 *
 * Usage:
 *   SANITY_API_TOKEN=<your-token> \
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id> \
 *   npx tsx src/sanity/seed.ts
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Error: SANITY_API_TOKEN is required to seed content.");
  console.error(
    "Create a token at https://www.sanity.io/manage/project/<projectId>/api#tokens"
  );
  process.exit(1);
}

if (projectId === "placeholder") {
  console.error(
    "Error: NEXT_PUBLIC_SANITY_PROJECT_ID must be set to your real project ID."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// Content from src/config/site.ts
const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  companyName: "R Kay Construction",
  email: "ryan@rkayconstruction.co.uk",
  phone: "+44 1234 567 890",
  address: "London, United Kingdom",
  tagline: "Quality Residential Construction Across the UK",
  subtagline: "Extensions • Renovations • New Builds • Loft Conversions",
  about: {
    intro:
      "R Kay Construction is a trusted residential building company delivering quality craftsmanship across the UK. With years of experience in extensions, renovations, and new builds, we take pride in transforming your vision into reality — on time and on budget.",
    values: [
      {
        _key: "val1",
        title: "Quality Craftsmanship",
        description:
          "Every project is built to the highest standards with meticulous attention to detail.",
      },
      {
        _key: "val2",
        title: "Reliable Service",
        description:
          "We deliver on our promises — on time, on budget, and with clear communication throughout.",
      },
      {
        _key: "val3",
        title: "Competitive Pricing",
        description:
          "Premium quality construction at fair, transparent prices with no hidden costs.",
      },
    ],
  },
  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },
  projectTypes: [
    "Extension",
    "Loft Conversion",
    "New Build",
    "Renovation",
    "Roofing",
    "Other",
  ],
};

const services = [
  {
    _type: "service",
    title: "House Extensions",
    description:
      "Expand your living space with beautifully designed single and double-storey extensions.",
    icon: "Home",
    order: 0,
  },
  {
    _type: "service",
    title: "Loft Conversions",
    description:
      "Transform unused loft space into stunning bedrooms, offices, or living areas.",
    icon: "ArrowUpFromLine",
    order: 1,
  },
  {
    _type: "service",
    title: "New Builds",
    description:
      "Complete new build construction from foundations to finishing touches.",
    icon: "Building2",
    order: 2,
  },
  {
    _type: "service",
    title: "Kitchen & Bathroom Renovations",
    description:
      "Modern, functional renovations that add value and style to your home.",
    icon: "UtensilsCrossed",
    order: 3,
  },
  {
    _type: "service",
    title: "Structural Alterations",
    description:
      "Load-bearing wall removal, RSJ installation, and structural reconfigurations.",
    icon: "Columns3",
    order: 4,
  },
  {
    _type: "service",
    title: "Roofing & Repairs",
    description:
      "Full roof replacements, repairs, and maintenance to protect your home.",
    icon: "HardHat",
    order: 5,
  },
];

const projects = [
  {
    _type: "project",
    title: "Two-Storey Extension — Surrey",
    description:
      "A spacious two-storey rear extension adding a modern kitchen and master bedroom suite.",
    location: "Surrey",
    order: 0,
  },
  {
    _type: "project",
    title: "Loft Conversion — London",
    description:
      "Victorian terrace loft conversion with dormer windows and en-suite bathroom.",
    location: "London",
    order: 1,
  },
  {
    _type: "project",
    title: "Full Renovation — Kent",
    description:
      "Complete interior renovation of a 1930s semi-detached, modernised throughout.",
    location: "Kent",
    order: 2,
  },
  {
    _type: "project",
    title: "New Build — Essex",
    description:
      "Four-bedroom detached new build with contemporary design and energy-efficient features.",
    location: "Essex",
    order: 3,
  },
  {
    _type: "project",
    title: "Kitchen Remodel — Hampshire",
    description:
      "Open-plan kitchen-diner with bi-fold doors, island unit, and premium finishes.",
    location: "Hampshire",
    order: 4,
  },
  {
    _type: "project",
    title: "Roofing Replacement — Berkshire",
    description:
      "Complete roof replacement with new slate tiles, insulation, and lead flashings.",
    location: "Berkshire",
    order: 5,
  },
];

const testimonials = [
  {
    _type: "testimonial",
    name: "James & Sarah T.",
    location: "Surrey",
    quote:
      "R Kay Construction transformed our home with a stunning two-storey extension. Professional from start to finish — we couldn't be happier with the result.",
    order: 0,
  },
  {
    _type: "testimonial",
    name: "David M.",
    location: "London",
    quote:
      "Brilliant work on our loft conversion. The team was reliable, tidy, and delivered exactly what was promised. Highly recommended.",
    order: 1,
  },
  {
    _type: "testimonial",
    name: "Emma & Chris P.",
    location: "Kent",
    quote:
      "From the initial quote to the final walkthrough, everything was handled with care and professionalism. Our kitchen renovation exceeded all expectations.",
    order: 2,
  },
];

async function seed() {
  console.log("🌱 Seeding Sanity content...\n");

  // Create siteSettings singleton
  console.log("📝 Creating site settings...");
  await client.createOrReplace(siteSettings);
  console.log("   ✅ Site settings created\n");

  // Create services
  console.log("🔧 Creating services...");
  for (const service of services) {
    const result = await client.create(service);
    console.log(`   ✅ ${service.title} (${result._id})`);
  }
  console.log();

  // Create projects
  console.log("🏗️  Creating projects...");
  for (const project of projects) {
    const result = await client.create(project);
    console.log(`   ✅ ${project.title} (${result._id})`);
  }
  console.log();

  // Create testimonials
  console.log("💬 Creating testimonials...");
  for (const testimonial of testimonials) {
    const result = await client.create(testimonial);
    console.log(`   ✅ ${testimonial.name} (${result._id})`);
  }

  console.log("\n🎉 Seeding complete! All content has been populated.");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
