import { GraduationCap, Map } from 'lucide-react';
import { ABOUT_OBJECTIVES } from '@/constants';
import RevealOnScroll from '../common/RevealOnScroll';

const ORBIT_LABELS = [
  ['left-[9%] top-[27%]', 'MESURE'],
  ['right-[2%] top-[48%]', 'DONNÉE'],
  ['bottom-[8%] left-[35%]', 'DÉCISION'],
] as const;

const AboutObjectives = () => (
  <section className="relative overflow-hidden bg-ink-950 section-y text-white">
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(152,192,112,.14),transparent_30%)]"
    />
    <div className="relative section-shell grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
      <RevealOnScroll variant="fade-left">
        <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-brand-300">
          <GraduationCap className="size-4" />
          Nos objectifs
        </span>
        <h2 className="mt-4 max-w-xl text-h2">
          Transformer la maîtrise technique en capacité d’action
        </h2>
        <div className="mt-8 space-y-4">
          {ABOUT_OBJECTIVES.map((objective, index) => (
            <div
              key={objective}
              className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-colors duration-(--duration-hover) hover:bg-white/[0.07]"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-300/15 font-tech text-caption text-brand-300">
                {index + 1}
              </span>
              <p className="text-justified leading-7 text-white/72">{objective}</p>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        variant="scale-in"
        delay={120}
        className="relative mx-auto aspect-square w-full max-w-md"
      >
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-white/10" />
        <div
          aria-hidden="true"
          className="absolute inset-[13%] animate-[spin_28s_linear_infinite] rounded-full border border-dashed border-brand-300/25 motion-reduce:animate-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-[27%] rounded-full border border-brand-300/25 bg-brand-300/[0.06]"
        />
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <Map className="mx-auto size-10 text-brand-300" />
            <strong className="mt-4 block font-tech tracking-[0.15em]">TERRITOIRE</strong>
            <span className="mt-1 block text-caption text-white/45">
              Observer · Analyser · Agir
            </span>
          </div>
        </div>
        {ORBIT_LABELS.map(([position, label]) => (
          <span
            key={label}
            className={`absolute ${position} rounded-full border border-white/10 bg-ink-950 px-3 py-1.5 font-tech text-[0.6rem] tracking-wider text-brand-300`}
          >
            {label}
          </span>
        ))}
      </RevealOnScroll>
    </div>
  </section>
);

export default AboutObjectives;
