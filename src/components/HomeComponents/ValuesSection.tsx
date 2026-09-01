import React from 'react';
import { Award, Briefcase, Globe2, Lightbulb, Network } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { StaggerReveal } from '../common/RevealOnScroll';
import ParticlesBackground from '../animations/ParticlesBackground';

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}

const VALUES: ValueItem[] = [
  {
    icon: <Award className="size-6 text-brand-600" />,
    title: 'Excellence',
    description:
      'Rechercher la qualité et la performance dans la formation et la pratique professionnelle.',
    tag: 'Rigueur & Qualité',
  },
  {
    icon: <Briefcase className="size-6 text-brand-600" />,
    title: 'Professionnalisation',
    description:
      'Développer des compétences directement adaptées aux exigences du monde du travail.',
    tag: 'Pratique & Emploi',
  },
  {
    icon: <Globe2 className="size-6 text-brand-600" />,
    title: 'Engagement',
    description: 'Contribuer activement au développement durable et à l’évolution des territoires.',
    tag: 'Impact Durable',
  },
  {
    icon: <Lightbulb className="size-6 text-brand-600" />,
    title: 'Innovation',
    description:
      'Encourager l’utilisation des nouvelles technologies et des approches modernes de la géomatique.',
    tag: 'High-Tech & Spatial',
  },
  {
    icon: <Network className="size-6 text-brand-600" />,
    title: 'Pluridisciplinarité',
    description:
      'Associer la géomatique à différents domaines pour répondre à des problématiques complexes.',
    tag: 'Synergie & Analyse',
  },
];

const ValuesSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-brand-300/10 section-y-tight">
      <ParticlesBackground particleCount={85} />
      <div className="absolute inset-0 -z-10 opacity-[0.03] [background-image:radial-gradient(circle_at_50%_50%,var(--color-brand-700)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="section-shell">
        <SectionHeader
          eyebrow="Principes Directeurs"
          title="Nos valeurs"
          description="L’ESSG fonde sa formation et son accompagnement sur des valeurs essentielles qui guident nos étudiants et enseignants au quotidien."
        />

        <StaggerReveal step={100} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((val, idx) => (
            <div
              key={val.title}
              className={`group relative flex flex-col justify-between rounded-3xl border border-ink-100 bg-ink-50/50 p-7 transition-all duration-300 ease-out hover:border-brand-300 hover:bg-white hover:shadow-card-hover ${
                idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-white text-brand-700 shadow-sm ring-1 ring-ink-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-100 group-hover:text-white">
                    {val.icon}
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 font-tech text-[0.65rem] font-bold text-brand-700 uppercase tracking-wider transition-colors group-hover:bg-brand-100">
                    {val.tag}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-h4 font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
                  {val.title}
                </h3>
                <p className="mt-2.5 text-justify text-body text-ink-600 leading-relaxed">
                  {val.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-100/60 flex items-center justify-between">
                <span className="font-tech text-caption text-ink-400">0{idx + 1} / 05</span>
                <div className="h-1 w-12 rounded-full bg-brand-100 group-hover:bg-brand-500 group-hover:w-20 transition-all duration-300" />
              </div>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
};

export default ValuesSection;
