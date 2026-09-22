import { Quote } from 'lucide-react';
import { DIRECTOR_MESSAGE } from '@/constants';
import TypedText from '../common/TypedText';
import RevealOnScroll from '../common/RevealOnScroll';

const DirectorMessageSection = () => {
  const { name, role, photo, photoAlt, typedWords, paragraphs } = DIRECTOR_MESSAGE;

  return (
    <section className="overflow-hidden bg-white section-y">
      <div className="section-shell">
        <RevealOnScroll className="mb-12 max-w-3xl">
          <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
            La Directrice de l’ESSG
          </span>
          <h2 className="mt-3 min-h-[2.5em] text-h2 text-ink-950 sm:min-h-[1.6em]">
            <TypedText words={typedWords} cursorClassName="bg-brand-600" />
          </h2>
        </RevealOnScroll>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <RevealOnScroll variant="fade-left" className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-4 hidden size-full rounded-3xl border border-brand-200 sm:block"
            />
            <figure className="group relative overflow-hidden rounded-3xl bg-brand-50 shadow-elevated">
              <img
                src={photo}
                alt={photoAlt}
                loading="lazy"
                decoding="async"
                width={720}
                height={960}
                className="aspect-[3/4] w-full object-cover object-top transition-transform duration-(--duration-section) motion-reduce:transform-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/60 to-transparent"
              />
            </figure>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-right" delay={140}>
            <blockquote className="relative rounded-3xl border border-brand-100 bg-brand-50/60 p-6 sm:p-9">
              <Quote
                aria-hidden="true"
                className="absolute -top-5 left-6 size-10 rounded-full bg-brand-700 p-2 text-white shadow-lg transition-transform duration-(--duration-hover) hover:rotate-6 motion-reduce:transform-none"
              />
              <div className="mt-4 space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    style={{ animationDelay: `${index * 120}ms` }}
                    className="animate-fade-in-up text-justified leading-8 text-ink-600 motion-reduce:animate-none"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <figcaption className="mt-8 flex items-center gap-4 border-t border-brand-100 pt-6">
                <span aria-hidden="true" className="h-10 w-1 rounded-full bg-brand-600" />
                <span>
                  <strong className="block text-h5 text-ink-950">{name}</strong>
                  <span className="text-small text-brand-700">{role}</span>
                </span>
              </figcaption>
            </blockquote>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessageSection;
