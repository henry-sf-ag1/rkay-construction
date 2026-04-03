import Image from "next/image";

interface HeroProps {
  companyName: string;
  tagline: string;
  subtagline: string;
  heroImage?: string;
}

export default function Hero({
  companyName,
  tagline,
  subtagline,
  heroImage,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Hero background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={heroImage || "/images/hero-bg.jpg"}
          alt="Construction site background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/85 to-primary/95" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center animate-fade-in-up">
          <div className="bg-white rounded-2xl p-4 shadow-2xl">
            <Image
              src="/logo.jpg"
              alt={companyName}
              width={120}
              height={120}
              className="rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Tagline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {tagline}
        </h1>

        {/* Subtext */}
        <p
          className="text-xl sm:text-2xl text-accent mb-10 font-light animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {subtagline}
        </p>

        {/* CTA */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#quote"
            className="inline-block bg-white text-primary font-semibold text-lg px-10 py-4 rounded-lg hover:bg-accent/20 hover:shadow-xl transition-all duration-300 shadow-lg"
          >
            Get a Free Quote
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-16 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
