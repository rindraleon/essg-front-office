import { Rocket } from 'lucide-react';
import { ABOUT_MISSION } from '@/constants';
import RevealOnScroll from '../common/RevealOnScroll';

const AboutMission = () => (
  <section className="bg-white section-y">
    <div className="section-shell">
      <RevealOnScroll className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
          <Rocket className="size-4" />
          {ABOUT_MISSION.eyebrow}
        </span>
        <h2 className="mt-3 text-h2 text-ink-950">Notre mission</h2>
      </RevealOnScroll>

      <div className="grid gap-5 lg:grid-cols-2">
        {ABOUT_MISSION.items.map((item, index) => (
          <RevealOnScroll key={item.id} delay={index * 100}>
            <article className="h-full rounded-3xl border border-brand-100 bg-brand-50 p-7 transition-[transform,box-shadow] duration-(--duration-hover) hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transform-none sm:p-9">
              <span className="grid size-10 place-items-center rounded-full bg-brand-700 font-tech text-small font-bold text-white">
                0{index + 1}
              </span>
              <p className="mt-6 text-justified text-body-lg leading-8 text-ink-600">
                <strong className="text-ink-950">{item.highlight}</strong> {item.text}
              </p>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

export default AboutMission;
