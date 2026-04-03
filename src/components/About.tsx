import { Award, Clock, PoundSterling } from "lucide-react";

const icons = [Award, Clock, PoundSterling];

interface AboutProps {
  intro: string;
  values: { title: string; description: string }[];
}

export default function About({ intro, values }: AboutProps) {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            Who We Are
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-8" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {values.map((value, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={value.title}
                className="text-center p-8 rounded-xl border border-gray-100 hover:border-accent/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-full mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
