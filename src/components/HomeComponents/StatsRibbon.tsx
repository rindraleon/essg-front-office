import React from 'react';
import { Award, BookOpen, GraduationCap, Users } from 'lucide-react';
import AnimatedNumber from '../common/AnimatedNumber';
import { RevealOnScroll, StaggerReveal } from '../common/RevealOnScroll';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
}

const STATS: StatItem[] = [
  {
    icon: <BookOpen className="size-6 text-brand-600" />,
    value: '6',
    label: "Parcours d'Excellence",
    sublabel: 'Licence & Master Habilités',
  },
  {
    icon: <GraduationCap className="size-6 text-brand-600" />,
    value: '100%',
    label: 'Stages & Débouchés',
    sublabel: 'Insertion Professionnelle Rapide',
  },
  {
    icon: <Users className="size-6 text-brand-600" />,
    value: '+15',
    label: 'Partenaires Majeurs',
    sublabel: 'Nationaux & Internationaux',
  },
  {
    icon: <Award className="size-6 text-brand-600" />,
    value: '1200m',
    label: 'Campus d’Andrainjato',
    sublabel: 'Cadre Universitaire Idéal',
  },
];

const StatsRibbon: React.FC = () => {
  return (
    <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <RevealOnScroll variant="scale-in">
        <div className="rounded-3xl border border-ink-100/80 bg-white/95 p-6 shadow-elevated backdrop-blur-xl sm:p-8">
          <StaggerReveal step={90} className="grid grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-ink-100">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 sm:px-4"
              >
                <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                  {stat.icon}
                </div>
                <strong className="font-display text-h2 font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                  <AnimatedNumber value={stat.value} duration={2000} />
                </strong>
                <span className="mt-1 block text-small font-semibold text-ink-800">
                  {stat.label}
                </span>
                <span className="mt-0.5 block text-caption text-ink-500">
                  {stat.sublabel}
                </span>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </RevealOnScroll>
    </section>
  );
};

export default StatsRibbon;
