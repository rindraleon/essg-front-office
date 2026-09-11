import { lazy } from 'react';
import {
  HeroSection,
  WhoWeAreSection,
  //DirectorMessageSection,
  ValuesSection,
  WhyChooseSection,
  FormationsDomainSection,
  DeferredSection,
} from '@/components';
import { useTitle, useFeaturedFormations } from '@/hooks';

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
  // La section statique « domaines » sert de repli : elle ne s'affiche que si
  // aucune formation gérée dans le back-office n'est disponible.
  const featuredQuery = useFeaturedFormations(6);
  const showFormationsDomain = !featuredQuery.loading && featuredQuery.formations.length === 0;
  return (
    <div className="flex flex-col">
      <HeroSection />
      <WhoWeAreSection />

      <ValuesSection />
      <WhyChooseSection />
      {showFormationsDomain && <FormationsDomainSection />}

      <DeferredSection minHeight={720}>
        <FormationsSection />
      </DeferredSection>

      <DeferredSection minHeight={720}>
        <ActualitesSection />
      </DeferredSection>

      <DeferredSection minHeight={720}>
        <ProjetsSection />
      </DeferredSection>

      <DeferredSection minHeight={420}>
        <PartenairesSection />
      </DeferredSection>

      <DeferredSection minHeight={720}>
        <RessourceHumaineSection />
      </DeferredSection>

      <DeferredSection minHeight={620}>
        <LocalisationSection />
      </DeferredSection>

      <DeferredSection minHeight={620}>
        <FaqSection />
      </DeferredSection>

      <DeferredSection minHeight={420}>
        <AdmissionSection />
      </DeferredSection>
    </div>
  );
};

export default Home;
