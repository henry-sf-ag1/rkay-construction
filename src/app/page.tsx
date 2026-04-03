import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import { getSiteSettings, getServices, getProjects, getTestimonials } from "@/lib/content";
import { siteConfig } from "@/config/site";

export const dynamic = 'force-dynamic'; // Dynamic rendering for near-instant content updates from blob storage

export default async function Home() {
  const [settings, services, projects, testimonials] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <main>
      <Navbar companyName={settings.companyName} />
      <Hero
        companyName={settings.companyName}
        tagline={settings.tagline}
        subtagline={settings.subtagline}
      />
      <About intro={siteConfig.about.intro} values={siteConfig.about.values} />
      <Services services={services} />
      <Projects projects={projects} />
      <Testimonials testimonials={testimonials} />
      <QuoteForm
        email={settings.email}
        quoteForm={settings.quoteForm}
      />
      <Footer
        companyName={settings.companyName}
        tagline={settings.tagline}
        email={settings.email}
        phone={settings.phone}
        address={settings.address}
        social={settings.social}
      />
    </main>
  );
}
