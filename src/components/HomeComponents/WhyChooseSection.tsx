import React from 'react';
import { 
  BookMarked, 
  Building2, 
  CheckCircle2, 
  Compass, 
  Database, 
  GraduationCap, 
  Map, 
  Mountain, 
  Sprout, 
  TrendingUp, 
  Trees, 
  Users 
} from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { RevealOnScroll, StaggerReveal } from '../common/RevealOnScroll';

const ADVANTAGES = [
  {
    icon: BookMarked,
    title: 'Des formations spécialisées',
    description: 'Des parcours dédiés aux sciences géomatiques et à leurs différentes applications pratiques.',
    highlight: '100% Spécialisé',
  },
  {
    icon: Users,
    title: 'Un ancrage professionnel',
    description: 'Des enseignements assurés par des professionnels et des intervenants expérimentés dans leurs domaines.',
    highlight: 'Corps Enseignant Mixte',
  },
  {
    icon: TrendingUp,
    title: 'Des compétences d’avenir',
    description: 'Des programmes conçus pour développer des compétences techniques, analytiques et opérationnelles adaptées aux évolutions du marché du travail.',
    highlight: 'Prêt pour l’Emploi',
  },
];

const SECTORS = [
  { name: 'Environnement', icon: Trees, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { name: 'Agriculture de précision', icon: Sprout, color: 'text-lime-700 bg-lime-50 border-lime-200' },
  { name: 'Aménagement du territoire', icon: Map, color: 'text-brand-700 bg-brand-50 border-brand-200' },
  { name: 'Urbanisme & Smart Cities', icon: Building2, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { name: 'Gestion des ressources naturelles', icon: Mountain, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { name: 'Cartographie & Topographie', icon: Compass, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { name: 'Gestion & Analyse de données spatiales', icon: Database, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { name: 'Développement territorial durable', icon: GraduationCap, color: 'text-rose-700 bg-rose-50 border-rose-200' },
];

const WhyChooseSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-brand-200/80 section-y-tight">
      <div className="section-shell">
        
        {/* Animated Section Header */}
        <SectionHeader
          eyebrow="Une formation tournée vers l’avenir"
          title="Pourquoi choisir l’ESSG ?"
          description="Choisir l’ESSG, c’est intégrer une école spécialisée qui associe formation académique, expertise professionnelle et nouvelles technologies. Nos formations sont conçues pour permettre aux étudiants d’acquérir des compétences adaptées aux besoins actuels et futurs du monde professionnel."
        />

        {/* 3 Key Advantages Cards */}
        <StaggerReveal step={100} className="mt-8 grid gap-6 md:grid-cols-3">
          {ADVANTAGES.map((adv) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-ink-100 bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-brand-300 hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-full bg-ink-100/70 px-3 py-1 font-tech text-[0.65rem] font-bold text-ink-700 transition-colors group-hover:bg-brand-100 group-hover:text-brand-800">
                      {adv.highlight}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-h4 font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
                    {adv.title}
                  </h3>
                  <p className="mt-3 text-justify text-body text-ink-600 leading-relaxed">
                    {adv.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-caption font-semibold text-brand-600">
                  <CheckCircle2 className="size-4" />
                  <span>Approche par compétences</span>
                </div>
              </div>
            );
          })}
        </StaggerReveal>

        {/* Career Sectors Showcase */}
        <RevealOnScroll variant="scale-in" delay={150} className="mt-14">
          <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-br from-white via-brand-50/20 to-brand-50/30 p-8 shadow-sm sm:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-100 pb-6">
              <div>
                <span className="font-tech text-caption font-bold text-brand-700 uppercase tracking-widest">
                  Opportunités & Carrières
                </span>
                <h3 className="mt-1 font-display text-h3 font-bold text-ink-900">
                  Des débouchés variés et porteurs
                </h3>
                <p className="mt-1 text-body text-ink-600">
                  Les compétences acquises à l'ESSG peuvent être directement mobilisées dans de nombreux secteurs stratégiques :
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SECTORS.map((sector) => {
                const SectorIcon = sector.icon;
                return (
                  <div
                    key={sector.name}
                    className="group flex items-center gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-300 hover:shadow-card"
                  >
                    <div className={`grid size-10 shrink-0 place-items-center rounded-xl border ${sector.color} transition-transform duration-300 group-hover:scale-110`}>
                      <SectorIcon className="size-5" />
                    </div>
                    <span className="text-small font-bold text-ink-800 leading-snug group-hover:text-brand-700 transition-colors">
                      {sector.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default WhyChooseSection;
