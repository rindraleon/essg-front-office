import { Binoculars, ScanLine } from 'lucide-react';
import { CAMPUS_GALLERY, SITE_HERO_IMAGE } from '@/constants';
import RevealOnScroll from '../common/RevealOnScroll';

const KEY_FACTS = [
  { label: 'DATA', caption: 'Comprendre avec précision' },
  { label: 'IMPACT', caption: 'Décider avec responsabilité' },
] as const;

const AboutIntro = () => (
  <section className="section-y">
    <div className="section-shell grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr]">
      <RevealOnScroll variant="fade-left" className="relative min-h-[30rem]">
        <div className="absolute left-0 top-0 w-[72%] overflow-hidden rounded-3xl shadow-elevated">
          <img
            loading="lazy"
            decoding="async"
            src={CAMPUS_GALLERY[0]?.src ?? SITE_HERO_IMAGE}
            alt={CAMPUS_GALLERY[0]?.alt ?? 'Campus ESSG'}
            className="aspect-[4/5] w-full object-cover transition-transform duration-(--duration-section) hover:scale-[1.03] motion-reduce:transform-none"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-[52%] overflow-hidden rounded-2xl border-[6px] border-[var(--color-ink-50)] shadow-elevated">
          <img
            loading="lazy"
            decoding="async"
            src={CAMPUS_GALLERY[1]?.src ?? SITE_HERO_IMAGE}
            alt={CAMPUS_GALLERY[1]?.alt ?? 'Vue du campus ESSG'}
            className="aspect-[4/3] w-full object-cover transition-transform duration-(--duration-section) hover:scale-[1.04] motion-reduce:transform-none"
          />
        </div>
        <div className="absolute right-[5%] top-[8%] rounded-2xl border border-white/70 bg-white/85 p-4 shadow-card backdrop-blur-xl">
          <ScanLine className="mb-2 size-5 text-brand-600" />
          <strong className="block font-tech text-small text-ink-900">21.4415° S</strong>
          <span className="text-caption text-ink-500">Andrainjato</span>
        </div>
      </RevealOnScroll>

      <RevealOnScroll variant="fade-right" delay={120}>
        <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
          <Binoculars className="size-4" />
          Notre identité
        </span>
        <h2 className="mt-4 max-w-2xl text-h2 text-ink-950">
          Une école où la science rencontre les enjeux réels du territoire
        </h2>
        <p className="mt-6 max-w-2xl text-justified text-body-lg leading-8 text-ink-600">
          L’École Supérieure des Sciences Géomatiques de l’Université de Fianarantsoa développe des
          compétences en géomatique, cartographie, télédétection et systèmes d’information
          géographique.
        </p>
        <p className="mt-4 max-w-2xl text-justified leading-7 text-ink-500">
          Notre approche relie les fondamentaux scientifiques, la maîtrise des technologies et
          l’expérience de terrain afin que chaque étudiant sache observer, analyser et agir.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {KEY_FACTS.map(({ label, caption }) => (
            <div
              key={label}
              className="rounded-2xl border border-brand-100 bg-white p-4 shadow-card"
            >
              <strong className="font-tech text-h4 text-brand-700">{label}</strong>
              <span className="mt-1 block text-caption text-ink-500">{caption}</span>
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </div>
  </section>
);

export default AboutIntro;
