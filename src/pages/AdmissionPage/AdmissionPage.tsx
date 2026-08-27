import { CalendarX2, LoaderCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { AdmissionPageProps } from '@/types';
import { AdmissionForm, PageHero, Breadcrumb, EmptyState } from '@/components';

import { SITE_HERO_IMAGE } from '@/constants';
import { useAdmissionsSettings, useTitle } from '@/hooks';

const HERO_IMAGE = SITE_HERO_IMAGE;

const AdmissionClosed = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-xl px-4 section-y-tight sm:px-6">
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
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white section-y-tight text-ink-500 shadow-card">
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
      />

      <Breadcrumb items={[{ label: 'Admission' }]} />

      <section className="section-y-tight">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {renderAdmissionContent()}
        </div>
      </section>
    </div>
  );
};

export default AdmissionPage;
