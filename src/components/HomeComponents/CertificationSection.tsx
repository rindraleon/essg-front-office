import React from 'react';
import useGsapReveal from '../../hooks/useGsapReveal';
import type { CertificationsSectionProps } from '../../types';

const CertificationsSection: React.FC<CertificationsSectionProps> = (
  props: Readonly<CertificationsSectionProps>
) => {
  const {
    title = 'Qui sommes-nous ?',
    description = "Créée en 2026 et reconnue par la Loi n° 2010-001, l'École Supérieure de Science Géomatique (ESSG) de l'Université de Fianarantsoa, Madagascar, forme les experts de demain en géomatique, topographie et aménagement du territoire. Reconnaissance nationale et internationale de notre excellence",
  } = props;

  const revealRef = useGsapReveal<HTMLElement>();

  return (
    <section ref={revealRef} className="bg-brand-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-gsap className="mb-8 text-center">
          <h2 className="mb-3 text-h2 text-ink-900">
            {title}
          </h2>
          <p className="mx-auto max-w-3xl text-ink-500 leading-7">{description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div data-gsap className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-card ring-1 ring-brand-100">
            <span className="text-ink-800 font-semibold">
              Reconnaissance nationale et internationale de notre excellence
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
