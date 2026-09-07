import { ABOUT_TIMELINE } from '@/constants';
import RevealOnScroll from '../common/RevealOnScroll';
import AboutSection from './AboutSection';

const AboutTimeline = () => (
  <AboutSection eyebrow="Notre trajectoire" title="Une école jeune, pensée pour durer" centered>
    <div className="relative grid gap-6 lg:grid-cols-3">
      <div
        aria-hidden="true"
        className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent lg:block"
      />
      {ABOUT_TIMELINE.map((item, index) => (
        <RevealOnScroll key={item.title} delay={index * 100} className="relative">
          <article className="group h-full rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-(--duration-hover) hover:border-brand-200 hover:shadow-card-hover motion-reduce:transform-none">
            <div className="relative z-10 grid size-16 place-items-center rounded-full border-[6px] border-[var(--color-ink-50)] bg-brand-700 font-tech text-small font-bold text-white shadow-lg">
              0{index + 1}
            </div>
            <span className="mt-7 block text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
              {item.step} · {item.date}
            </span>
            <h3 className="mt-2 text-h5 text-ink-950">{item.title}</h3>
            <p className="mt-3 text-justified text-small leading-6 text-ink-500">
              {item.description}
            </p>
          </article>
        </RevealOnScroll>
      ))}
    </div>
  </AboutSection>
);

export default AboutTimeline;
