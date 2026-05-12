import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import { getSiteSettings, getServices, getProjects, getTestimonials } from "@/lib/content";

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
        heroImage={(settings as any).heroImage}
      />
      <About intro={(settings as any).about?.intro || 'About us'} values={(settings as any).about?.values || []} />
      <Services
        services={services}
        subtitle={(settings as any).sectionSubtitles?.services}
      />
      <Projects
        projects={projects}
        subtitle={(settings as any).sectionSubtitles?.ourWork}
      />
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
