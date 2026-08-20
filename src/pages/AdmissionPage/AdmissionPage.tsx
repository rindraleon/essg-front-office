import { CalendarX2, CircleHelp, GraduationCap, LoaderCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { AdmissionPageProps } from '../../types/admission.types';
import {
  AdmissionForm,
  ContactCard,
  CtaSection,
  PageHero,
  Breadcrumb,
  EmptyState,
} from '../../components';

import { SITE_HERO_IMAGE } from '../../constants/media';
import { useAdmissionsSettings } from '@/hooks';
import { useTitle } from '@/hooks/useTitle';

const HERO_IMAGE = SITE_HERO_IMAGE;

const AdmissionClosed = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <EmptyState
        icon={<CalendarX2 className="size-10" />}
        title="Les inscriptions sont actuellement fermées"
        description="Merci de consulter régulièrement notre site pour connaître la prochaine période d'admission."
        actionLabel="Nous contacter"
        onAction={() => navigate('/contact')}
      />
    </div>
  );
};

const AdmissionPage: React.FC<AdmissionPageProps> = (props: Readonly<AdmissionPageProps>) => {
  useTitle('Admission | ESSG');

  const { data: settings, isLoading } = useAdmissionsSettings();
  const admissionsOuvertes = settings?.admissionsOuvertes ?? true;

  const {
    pageTitle = 'Admission',
    pageDescription = "Rejoignez l'ESSG et commencez votre parcours vers l'excellence en sciences géomatiques.",
  } = props;

  const renderAdmissionContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-ink-100 bg-white py-16 text-ink-500 shadow-card">
          <LoaderCircle className="size-8 animate-spin text-brand-600" />
          <p className="text-small">Chargement du formulaire...</p>
        </div>
      );
    }
    return admissionsOuvertes ? <AdmissionForm /> : <AdmissionClosed />;
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Admission ESSG"
        title={pageTitle}
        description={pageDescription}
        stats={[
          { value: 'Jan-Mai', label: 'Candidatures' },
          { value: 'Juin', label: 'Examens' },
          { value: 'Sept', label: 'Rentrée' },
        ]}
      />

      <Breadcrumb items={[{ label: 'Admission' }]} />

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {renderAdmissionContent()}

          <div className="mt-8">
            <ContactCard
              icon={<CircleHelp />}
              title="Besoin d'aide ?"
              description="Si vous rencontrez des difficultés ou avez des questions sur le processus d'admission, notre équipe est là pour vous aider."
              primaryLabel="admission@essg.mg"
              primaryLink="admission@essg.mg"
              secondaryLabel="+261 34 28 085 30"
              secondaryLink="/contact"
            />
          </div>
        </div>
      </section>

      <CtaSection
        icon={<GraduationCap />}
        title="Découvrez nos formations"
        description="Explorez nos programmes d'excellence en sciences géomatiques avant de soumettre votre candidature."
        primaryLabel="Voir les formations"
        primaryLink="/formations"
        secondaryLabel="Questions fréquentes"
        secondaryLink="/faq"
      />
    </div>
  );
};

export default AdmissionPage;
