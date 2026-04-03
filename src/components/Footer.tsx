import Image from "next/image";
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & company */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-lg p-2">
                <Image
                  src="/logo.jpg"
                  alt={siteConfig.companyName}
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>
              <span className="font-bold text-lg">{siteConfig.companyName}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {siteConfig.tagline}. Trusted residential building services across
              the United Kingdom.
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                {siteConfig.email}
              </a>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {siteConfig.address}
              </div>
            </div>
          </div>

          {/* Social & quick links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex items-center gap-4 mb-6">
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                aria-label="LinkedIn"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="space-y-2">
              <a href="#about" className="block text-sm text-gray-300 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#services" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Services
              </a>
              <a href="#projects" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Our Work
              </a>
              <a href="#quote" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Get a Quote
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 {siteConfig.companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
