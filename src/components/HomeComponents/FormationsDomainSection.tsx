import React from 'react';
import { ArrowRight, Binary, Briefcase, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RevealOnScroll, StaggerReveal } from '../common/RevealOnScroll';
import ParticlesBackground from '../animations/ParticlesBackground';
import SectionHeader from '../common/SectionHeader';

interface DomainItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  gradient: string;
}

const DOMAINS: DomainItem[] = [
  {
    icon: <Binary className="size-6 text-emerald-400" />,
    title: 'Géomatique Informatique',
    subtitle: 'Technos numériques & Données spatiales',
    description:
      'Une formation orientée vers l’informatique, les données spatiales, les systèmes d’information géographique (SIG) et les technologies numériques appliquées à la géomatique.',
    tags: ['SIG Web & Cloud', 'Bases de données spatiales', 'Programmation Géomatique'],
    gradient: 'from-emerald-950/90 to-brand-950/90',
  },
  {
    icon: <Compass className="size-6 text-brand-300" />,
    title: 'Géomatique et Applications',
    subtitle: 'Environnement, Agriculture & Territoires',
    description:
      'Une formation axée sur l’utilisation de la géomatique dans différents secteurs tels que l’environnement, l’agriculture, l’aménagement et la gestion des territoires.',
    tags: ['Télédétection & Drones', 'Ressources naturelles', 'Aménagement du territoire'],
    gradient: 'from-brand-900/95 to-brand-950/95',
  },
  {
    icon: <Briefcase className="size-6 text-teal-300" />,
    title: 'Géomatique et Management',
    subtitle: 'Leadership, Communication & Durabilité',
    description:
      'Une formation associant les sciences géomatiques aux domaines du management, de la communication, de la gestion de projets et du développement durable.',
    tags: ['Management territorial', 'Développement durable', 'Gestion de projets spatiaux'],
    gradient: 'from-teal-950/90 to-brand-950/90',
  },
];

const FormationsDomainSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-brand-950 section-y-tight text-white">
      <ParticlesBackground particleCount={85} />
      {/* Background glow and subtle grid */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(152,192,112,.12),transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_70%,rgb(84_124_54_/_.2),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="section-shell">
        {}
        <SectionHeader
          eyebrow="Des parcours adaptés aux enjeux de demain"
          title="Nos formations"
          description="L’ESSG propose des formations d'excellence dans plusieurs domaines clés des sciences géomatiques."
        />

        {/* 3 Domain Cards */}
        <StaggerReveal step={120} className="mt-12 grid gap-8 md:grid-cols-3">
          {DOMAINS.map((domain, index) => (
            <div
              key={domain.title}
              className={`group relative flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-b ${domain.gradient} p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out hover:border-brand-300/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.6)]`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-400 group-hover:text-brand-950">
                    {domain.icon}
                  </div>
                  <span className="font-tech text-caption font-semibold tracking-wider text-brand-300/80">
                    AXE 0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-h3 font-bold text-white group-hover:text-brand-200 transition-colors">
                  {domain.title}
                </h3>
                <span className="mt-1 block font-tech text-[0.7rem] uppercase tracking-wider text-brand-300">
                  {domain.subtitle}
                </span>

                <p className="mt-4 text-justify text-body text-white/75 leading-relaxed">
                  {domain.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {domain.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[0.72rem] font-medium text-white/80 transition-colors group-hover:border-white/20 group-hover:bg-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <Link
                  to="/formations"
                  className="inline-flex items-center gap-1.5 text-small font-semibold text-brand-300 transition-colors hover:text-white"
                >
                  Voir les parcours
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <div className="size-2 rounded-full bg-brand-400/60 group-hover:scale-150 transition-transform" />
              </div>
            </div>
          ))}
        </StaggerReveal>

        {/* Bottom Banner */}
        <RevealOnScroll variant="fade-up" delay={200} className="mt-12 text-center">
          <p className="text-small text-white/60">
            Toutes nos formations sont habilitées et délivrent des diplômes nationaux reconnus
            (Licence & Master LMD).
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default FormationsDomainSection;
