import {
  Home,
  ArrowUpFromLine,
  Building2,
  UtensilsCrossed,
  Columns3,
  HardHat,
  LucideIcon,
  Wrench,
} from "lucide-react";
import type { ServiceData } from "@/types";

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  Home,
  ArrowUpFromLine,
  Building2,
  UtensilsCrossed,
  Columns3,
  HardHat,
  Wrench,
};

// Fallback order for static data (no icon field)
const fallbackIcons: LucideIcon[] = [
  Home,
  ArrowUpFromLine,
  Building2,
  UtensilsCrossed,
  Columns3,
  HardHat,
];

interface ServicesProps {
  services: ServiceData[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-24 bg-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-2">
            Our Services
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-8" />
          <p className="text-lg text-services-text max-w-2xl mx-auto">
            From foundations to finishing touches, we deliver comprehensive
            residential construction services.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {services.map((service, index) => {
            const Icon =
              (service.icon && iconMap[service.icon]) ||
              fallbackIcons[index % fallbackIcons.length];
            return (
              <div
                key={service.slug}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-lg mb-5 group-hover:bg-primary/90 transition-colors">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-3">
                  {service.title}
                </h3>
                <p className="text-services-text leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
