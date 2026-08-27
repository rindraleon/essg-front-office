import { ArrowRight, Database, Layers, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RevealOnScroll } from '../common/RevealOnScroll';
import SectionHeader from '../common/SectionHeader';
import ParticlesBackground from '../animations/ParticlesBackground';
import { cn } from '@/lib';
import { buttonVariants } from '../ui/button';

const MISSION_PILLARS = [
  {
    icon: Database,
    title: 'Collecter & Structurer',
    text: 'Acquérir la donnée spatiale de terrain, GNSS et satellite avec une rigueur scientifique absolue.',
  },
  {
    icon: Layers,
    title: 'Analyser & Modéliser',
    text: 'Exploiter les Systèmes d’Information Géographique, le traitement d’images et la télédétection.',
  },
  {
    icon: Target,
    title: 'Valoriser & Décider',
    text: 'Fournir des solutions concrètes pour l’aménagement, l’environnement et le développement territorial.',
  },
] as const;

const WhoWeAreSection = () => {

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 section-y-tight text-white">
      <ParticlesBackground particleCount={85} />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(27,31,34,.98)_0%,rgba(27,31,34,.92)_48%,rgba(27,31,34,.65)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_40%,rgba(152,192,112,.2),transparent_36%)]" />

      <div className="relative section-shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <div className="max-w-3xl">
            <SectionHeader
              align="left"
              dark
              eyebrow="Une école spécialisée en géomatique"
              title="Qui sommes-nous ?"
              className="mb-8 sm:mb-8"
              description={
                <div className="space-y-4">
                  <p className="text-justify">
                    L’
                    <strong className="font-semibold text-white">
                      École Supérieure des Sciences Géomatiques (ESSG)
                    </strong>{' '}
                    est une école supérieure implantée au cœur de l’
                    <strong className="font-semibold text-brand-200">
                      Université de Fianarantsoa
                    </strong>{' '}
                    et spécialisée dans le domaine de la géomatique.
                  </p>
                  <p className="text-justify text-white/70">
                    Notre mission est de former des professionnels compétents, capables de{' '}
                    <strong className="font-semibold text-white">
                      collecter, analyser, exploiter et valoriser les données géographiques et
                      spatiales
                    </strong>{' '}
                    afin de répondre aux enjeux actuels de développement, d’aménagement et de
                    gestion des territoires.
                  </p>
                </div>
              }
            />

            <div className="mt-8">
              <Link
                to="/about"
                className={cn(buttonVariants({ variant: 'onDark', size: 'lg' }), 'group')}
              >
                Découvrir l’ESSG et son histoire
                <ArrowRight className="size-4 transition-transform duration-(--duration-quick) group-hover:translate-x-1 motion-reduce:transform-none" />
              </Link>
            </div>
          </div>

          <RevealOnScroll variant="fade-right" delay={120} className="relative lg:pl-6">
            <div className="rounded-3xl border border-white/20 bg-brand-950/60 p-6 shadow-[0_24px_70px_-20px_rgba(0,0,0,.75)] backdrop-blur-2xl sm:p-7">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-tech text-[0.65rem] uppercase tracking-[0.2em] text-brand-300 font-bold">
                    Mission Fondamentale
                  </span>
                  <strong className="mt-1 block font-display text-h5 text-white">Observer · Mesurer · Transformer</strong>
                </div>
                <div className="rounded-full bg-brand-400/20 px-3 py-1 text-caption font-tech font-bold text-brand-200">
                  ESSG
                </div>
              </div>
              <div className="space-y-3.5">
                {MISSION_PILLARS.map(({ icon: Icon, title, text }, index) => (
                  <article
                    key={title}
                    className="group flex items-start gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.05] p-4.5 transition-all duration-300 ease-out hover:translate-x-2 hover:border-brand-300/40 hover:bg-white/[0.1] hover:shadow-lg motion-reduce:transform-none"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-300/15 text-brand-300 ring-1 ring-brand-300/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-400 group-hover:text-brand-950 motion-reduce:transform-none">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-tech text-[0.65rem] text-brand-300/70 font-semibold">0{index + 1}</span>
                        <h3 className="text-small font-bold text-white group-hover:text-brand-200 transition-colors">{title}</h3>
                      </div>
                      <p className="mt-1.5 text-justify text-caption leading-relaxed text-white/70">{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
