import { Gauge, Layers, Sparkles, Target, type LucideIcon } from 'lucide-react';
import { ABOUT_VALUES } from '@/constants';
import RevealOnScroll from '../common/RevealOnScroll';

const VALUE_ICONS: Record<string, LucideIcon> = {
  maitrise: Gauge,
  pluridisciplinarite: Layers,
  professionnalisation: Target,
  impacts: Sparkles,
};

const AboutValues = () => (
  <section className="bg-brand-50 section-y">
    <div className="section-shell">
      <RevealOnScroll className="mb-12 max-w-2xl">
        <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
          Nos valeurs
        </span>
        <h2 className="mt-3 text-h2 text-ink-950">
          Maîtrise, pluridisciplinarité, professionnalisation et impacts
        </h2>
      </RevealOnScroll>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT_VALUES.map(({ id, title, description }, index) => {
          const Icon = VALUE_ICONS[id] ?? Sparkles;
          return (
            <RevealOnScroll key={id} delay={index * 80}>
              <article className="group h-full rounded-2xl border border-brand-100 bg-white p-6 transition-[transform,box-shadow,border-color] duration-(--duration-hover) hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-card-hover motion-reduce:transform-none">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-transform duration-(--duration-hover) group-hover:rotate-3 group-hover:scale-105 motion-reduce:transform-none">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-6 text-h5 text-ink-950">{title}</h3>
                <p className="mt-3 text-justified text-small leading-6 text-ink-500">
                  {description}
                </p>
              </article>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  </section>
);

export default AboutValues;
