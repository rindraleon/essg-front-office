import { Eye } from 'lucide-react';
import { ABOUT_VISION } from '@/constants';
import RevealOnScroll from '../common/RevealOnScroll';

const AboutVision = () => (
  <section className="border-t border-ink-100 bg-white section-y">
    <div className="section-shell">
      <RevealOnScroll variant="fade-up">
        <article className="group relative overflow-hidden rounded-3xl bg-brand-950 p-7 text-white sm:p-12">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 size-56 rounded-full border border-brand-300/20 transition-transform duration-(--duration-section) group-hover:scale-125 motion-reduce:transform-none"
          />
          <div
            aria-hidden="true"
            className="absolute -right-4 top-4 size-36 rounded-full border border-brand-300/15"
          />
          <Eye className="size-8 text-brand-300" />
          <span className="mt-8 block font-tech text-caption tracking-[0.18em] text-brand-300">
            {ABOUT_VISION.eyebrow.toUpperCase()}
          </span>
          <div className="mt-4 max-w-3xl space-y-3">
            {ABOUT_VISION.statements.map((statement) => (
              <p key={statement} className="text-justified text-h4 leading-relaxed">
                {statement}
              </p>
            ))}
          </div>
        </article>
      </RevealOnScroll>
    </div>
  </section>
);

export default AboutVision;
