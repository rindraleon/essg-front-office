import { lazy } from 'react';
import {
  HeroSection,
  WhoWeAreSection,
  ValuesSection,
  WhyChooseSection,
  FormationsDomainSection,
  DeferredSection,
} from '@/components';
import { useTitle } from '@/hooks';

const FormationsSection = lazy(() => import('@/components/HomeComponents/FormationSection'));
const ActualitesSection = lazy(() => import('@/components/HomeComponents/ActualitesSection'));
const ProjetsSection = lazy(() => import('@/components/HomeComponents/ProjetsSection'));
const PartenairesSection = lazy(() => import('@/components/HomeComponents/PartenairesSection'));
const RessourceHumaineSection = lazy(
  () => import('@/components/HomeComponents/RessourceHumaineSection')
);
const LocalisationSection = lazy(() => import('@/components/HomeComponents/LocalisationSection'));
const FaqSection = lazy(() => import('@/components/HomeComponents/FaqSection'));
const AdmissionSection = lazy(() => import('@/components/HomeComponents/AdmissionSection'));

const Home = () => {
  useTitle('Accueil | École Supérieure des Sciences Géomatiques (ESSG)');
  return (
    <div className="flex flex-col">
      {/* 1. Slogan & Hero */}
      <HeroSection />

      {/* 2. Qui sommes-nous ? */}
      <WhoWeAreSection />

      {/* 3. Nos valeurs */}
      <ValuesSection />

      {/* 4. Pourquoi choisir l’ESSG ? */}
      <WhyChooseSection />

      {/* 5. Nos formations — Domaines & Parcours */}
      <FormationsDomainSection />

      {/* Dynamic Catalog Section */}
      <DeferredSection minHeight={720}>
        <FormationsSection />
      </DeferredSection>

      {/* Actualités */}
      <DeferredSection minHeight={720}>
        <ActualitesSection />
      </DeferredSection>

      {/* Projets & Réalisations */}
      <DeferredSection minHeight={720}>
        <ProjetsSection />
      </DeferredSection>

      {/* Partenaires */}
      <DeferredSection minHeight={420}>
        <PartenairesSection />
      </DeferredSection>

      {/* Corps enseignant & Équipe */}
      <DeferredSection minHeight={720}>
        <RessourceHumaineSection />
      </DeferredSection>

      {/* 6. Contact & Localisation */}
      <DeferredSection minHeight={620}>
        <LocalisationSection />
      </DeferredSection>

      {/* FAQ */}
      <DeferredSection minHeight={620}>
        <FaqSection />
      </DeferredSection>

      {/* Admission CTA */}
      <DeferredSection minHeight={420}>
        <AdmissionSection />
      </DeferredSection>
    </div>
  );
};

export default Home;
