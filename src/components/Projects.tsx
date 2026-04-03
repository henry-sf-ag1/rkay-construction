import { MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            Our Work
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-8" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A selection of our recent residential construction projects across
            the UK.
          </p>
        </div>

        {/* Projects grid */}
        {/* TODO: Replace placeholder images with real project photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {siteConfig.projects.map((project) => (
            <div
              key={project.title}
              className="group rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              {/* Placeholder image area */}
              <div className="construction-pattern h-52 relative flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {project.title.split("—")[1]?.trim() || "UK"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
