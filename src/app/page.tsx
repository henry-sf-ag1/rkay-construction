import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import { client, projectId } from "@/sanity/lib/client";
import {
  siteSettingsQuery,
  servicesQuery,
  projectsQuery,
  testimonialsQuery,
} from "@/sanity/lib/queries";
import { siteConfig } from "@/config/site";
import type {
  SiteSettings,
  ServiceData,
  ProjectData,
  TestimonialData,
} from "@/sanity/types";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getSanityData() {
  // Skip Sanity fetch if project ID isn't configured
  if (projectId === "placeholder") {
    return null;
  }

  try {
    const [settings, services, projects, testimonials] = await Promise.all([
      client.fetch<SiteSettings | null>(siteSettingsQuery),
      client.fetch<ServiceData[]>(servicesQuery),
      client.fetch<ProjectData[]>(projectsQuery),
      client.fetch<TestimonialData[]>(testimonialsQuery),
    ]);

    return { settings, services, projects, testimonials };
  } catch (error) {
    console.error("Failed to fetch from Sanity, using static fallback:", error);
    return null;
  }
}

export default async function Home() {
  const sanityData = await getSanityData();

  // Merge Sanity data with static fallback
  const settings = sanityData?.settings;
  const companyName = settings?.companyName ?? siteConfig.companyName;
  const email = settings?.email ?? siteConfig.email;
  const phone = settings?.phone ?? siteConfig.phone;
  const address = settings?.address ?? siteConfig.address;
  const tagline = settings?.tagline ?? siteConfig.tagline;
  const subtagline = settings?.subtagline ?? siteConfig.subtagline;
  const about = settings?.about ?? siteConfig.about;
  const social = settings?.social ?? siteConfig.social;
  const projectTypes = settings?.projectTypes ?? siteConfig.projectTypes;

  const services = sanityData?.services?.length
    ? sanityData.services
    : siteConfig.services.map((s, i) => ({
        _id: `static-${i}`,
        title: s.title,
        description: s.description,
        icon: "",
        order: i,
      }));

  const projects = sanityData?.projects?.length
    ? sanityData.projects
    : siteConfig.projects.map((p, i) => ({
        _id: `static-${i}`,
        title: p.title,
        description: p.description,
        location: p.title.split("—")[1]?.trim() || "UK",
        order: i,
      }));

  const testimonials = sanityData?.testimonials?.length
    ? sanityData.testimonials
    : siteConfig.testimonials.map((t, i) => ({
        _id: `static-${i}`,
        name: t.name,
        location: t.location,
        quote: t.quote,
        order: i,
      }));

  return (
    <main>
      <Navbar companyName={companyName} />
      <Hero
        companyName={companyName}
        tagline={tagline}
        subtagline={subtagline}
        logo={settings?.logo}
      />
      <About intro={about.intro} values={about.values} />
      <Services services={services} />
      <Projects projects={projects} />
      <Testimonials testimonials={testimonials} />
      <QuoteForm email={email} projectTypes={projectTypes} />
      <Footer
        companyName={companyName}
        tagline={tagline}
        email={email}
        phone={phone}
        address={address}
        social={social}
      />
    </main>
  );
}
