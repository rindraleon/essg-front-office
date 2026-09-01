import { ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import React from 'react';
import Button from '../compat/button';
import { Link as RouterLink } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import ParticlesBackground from '../animations/ParticlesBackground';
import useGsapReveal from '@/hooks/useGsapReveal';
import { useAdmissionsOuvertes } from '@/hooks';
import type { AdmissionCtaSectionProps } from '@/types';

const AdmissionSection: React.FC<AdmissionCtaSectionProps> = (
  props: Readonly<AdmissionCtaSectionProps>
) => {
  const {
    title = "Prêt à rejoindre l'ESSG ?",
    description = "Prenez part à la nouvelle génération d'experts en sciences géomatiques et technologies spatiales.",
    primaryButtonLabel = 'Déposer ma candidature',
    primaryButtonLink = '/admission',
    secondaryButtonLabel = 'Nous contacter',
    secondaryButtonLink = '/contact',
  } = props;

  const revealRef = useGsapReveal<HTMLElement>();
  const admissionsOuvertes = useAdmissionsOuvertes();

  if (!admissionsOuvertes) return null;

  return (
    <section
      ref={revealRef}
      data-surface="dark"
      className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 section-y text-white"
    >
      <ParticlesBackground particleCount={85} />
      <div className="absolute inset-0 -z-10 opacity-15 [background-image:radial-gradient(circle_at_50%_50%,var(--color-brand-400)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute -left-20 top-1/2 -z-10 size-96 -translate-y-1/2 rounded-full bg-brand-400/10 blur-3xl" />
      <div className="absolute -right-20 top-1/2 -z-10 size-96 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="section-shell">
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-white/15 bg-white/[0.04] p-8 text-center shadow-elevated backdrop-blur-xl sm:p-12">
          <SectionHeader
            align="center"
            size="lg"
            dark
            eyebrow="Session d'admission 2026-2027"
            title={title}
            description={description}
            className="mb-8 sm:mb-8"
          />

          <div
            data-gsap
            className="mb-10 flex flex-wrap items-center justify-center gap-6 text-small text-white/85"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-brand-400" />
              <span>Dossier 100% en ligne</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-brand-400" />
              <span>Réponse rapide du jury</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-brand-400" />
              <span>Accompagnement personnalisé</span>
            </div>
          </div>

          <div data-gsap className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              component={RouterLink}
              to={primaryButtonLink}
              variant="contained"
              size="large"
              endIcon={<ArrowRight className="size-4" />}
              className="bg-brand-400 text-brand-950 hover:bg-brand-300 font-bold shadow-lg"
            >
              {primaryButtonLabel}
            </Button>

            <Button
              component={RouterLink}
              to={secondaryButtonLink}
              variant="outlined"
              size="large"
              startIcon={<FileText className="size-4 text-brand-300" />}
              className="border-white/30 text-white hover:bg-white/10"
            >
              {secondaryButtonLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionSection;
