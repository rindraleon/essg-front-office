import { Check } from 'lucide-react';
import { CAMPUS_GALLERY } from '@/constants';
import RevealOnScroll from '../common/RevealOnScroll';

function gallerySpan(index: number): string {
  if (index === 0) return 'lg:col-span-7';
  if (index === 1) return 'lg:col-span-5';
  return 'lg:col-span-6';
}

const AboutCampus = () => (
  <section className="section-y">
    <div className="section-shell">
      <RevealOnScroll className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
            Le cadre d’étude
          </span>
          <h2 className="mt-3 text-h2 text-ink-950">Le campus, sous un autre angle</h2>
        </div>
        <p className="max-w-md text-justified text-small leading-6 text-ink-500">
          Un environnement universitaire ouvert sur les reliefs et les enjeux territoriaux de
          Madagascar.
        </p>
      </RevealOnScroll>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {CAMPUS_GALLERY.map((image, index) => (
          <RevealOnScroll key={image.src} delay={index * 70} className={gallerySpan(index)}>
            <figure className="group relative overflow-hidden rounded-2xl bg-ink-100 shadow-card">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                width={900}
                height={675}
                className={`w-full object-cover transition-transform duration-(--duration-section) group-hover:scale-[1.04] motion-reduce:transform-none ${index < 2 ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-transparent to-transparent opacity-75 transition-opacity duration-(--duration-hover) group-hover:opacity-100"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5 text-small font-semibold text-white">
                <span>{image.alt}</span>
                <Check className="size-4 text-brand-300" />
              </figcaption>
            </figure>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

export default AboutCampus;
