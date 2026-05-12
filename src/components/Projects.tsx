import { MapPin } from "lucide-react";
import Image from "next/image";
import type { ProjectData } from "@/types";

interface ProjectsProps {
  projects: ProjectData[];
  subtitle?: string;
}

export default function Projects({ projects, subtitle }: ProjectsProps) {
  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-2">
            Our Work
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-8" />
          <p className="text-lg text-projects-text max-w-2xl mx-auto">
            {subtitle || 'RKay Construction are an Epping based, trusted building and home improvement company, delivering quality craftsmanship across Essex and London.'}
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="group rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              {/* Image area */}
              {project.image ? (
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[400px] object-cover"
                  />
                </div>
              ) : (
                <div className="construction-pattern aspect-[4/3] relative flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {project.location || "UK"}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-primary/80 transition-colors">
                  {project.title}
                </h3>
                <p className="text-projects-text text-sm leading-relaxed">
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
