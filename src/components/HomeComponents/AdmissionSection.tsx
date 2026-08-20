import { ArrowRight } from 'lucide-react';
import React from 'react';
import Button from '@/components/compat/button';
import { Link as RouterLink } from 'react-router-dom';
import useGsapReveal from '../../hooks/useGsapReveal';
import { useAdmissionsOuvertes } from '../../hooks/useAdmissionsSettings';
import type { AdmissionCtaSectionProps } from '../../types/admission.types';

const AdmissionSection: React.FC<AdmissionCtaSectionProps> = (
  props: Readonly<AdmissionCtaSectionProps>
) => {
  const {
    title = "Prêt à rejoindre l'ESSG ?",
    description = "Commencez votre parcours vers l'excellence en sciences géomatiques",
    primaryButtonLabel = 'Postuler maintenant',
    primaryButtonLink = '/admission',
    secondaryButtonLabel = 'Demander des informations',
    secondaryButtonLink = '/contact',
  } = props;

  const revealRef = useGsapReveal<HTMLElement>();
  const admissionsOuvertes = useAdmissionsOuvertes();

  if (!admissionsOuvertes) return null;

  return (
    <section
      ref={revealRef}
      data-surface="dark"
      className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 py-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 data-gsap className="mb-4 text-h2">
          {title}
        </h2>

        <p data-gsap className="mx-auto mb-8 max-w-2xl text-h4 text-sage-100/90">
          {description}
        </p>

        <div data-gsap className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            component={RouterLink}
            to={primaryButtonLink}
            variant="contained"
            size="large"
            endIcon={<ArrowRight className="size-4" />}
          >
            {primaryButtonLabel}
          </Button>

          <Button component={RouterLink} to={secondaryButtonLink} variant="outlined" size="large">
            {secondaryButtonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdmissionSection;
