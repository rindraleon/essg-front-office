import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import routesStatic from './routes';

const Home = lazy(() => import('@/pages/HomePage/Home'));
const AboutPage = lazy(() => import('@/pages/AboutPage/AboutPage'));
const FormationsPage = lazy(() => import('@/pages/FormationPage/Formations'));
const FormationDetailPage = lazy(() => import('@/pages/FormationPage/FormationDetailPage'));
const ActualitesPage = lazy(() => import('@/pages/ActualitePage/ActualitePage'));
const ActualiteDetailPage = lazy(() => import('@/pages/ActualitePage/ActualiteDetailPage'));
const PartenairesPage = lazy(() => import('@/pages/PartenairesPage/Partenaires'));
const PartenaireDetailPage = lazy(() => import('@/pages/PartenairesPage/PartenaireDetailPage'));
const RessourcesHumainesPage = lazy(
  () => import('@/pages/RessourcesHumainesPage/RessourcesHumainesPage')
);
const RessourceHumaineDetailPage = lazy(
  () => import('@/pages/RessourcesHumainesPage/RessourceHumaineDetailPage')
);
const ProjetsPage = lazy(() => import('@/pages/ProjetsPage/ProjetsPage'));
const ProjetDetailPage = lazy(() => import('@/pages/ProjetsPage/ProjetDetailPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage/FaqPage'));
const AdmissionPage = lazy(() => import('@/pages/AdmissionPage/AdmissionPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage/ContactPage'));
const MentionsLegalesPage = lazy(() => import('@/pages/LegalPage/MentionsLegalesPage'));
const PolitiqueConfidentialitePage = lazy(
  () => import('@/pages/LegalPage/PolitiqueConfidentialitePage')
);

const RouteLoading = () => (
  <output
    className="grid min-h-[55vh] place-items-center bg-gradient-to-b from-brand-50/40 to-white"
    aria-label="Chargement de la page"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="size-9 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600 motion-reduce:animate-none" />
      <span className="text-small text-ink-500">Chargement...</span>
    </div>
  </output>
);

const AppRoutes = () => (
  <Suspense fallback={<RouteLoading />}>
    <Routes>
      <Route path={routesStatic.home} element={<Home />} />
      <Route path={routesStatic.about} element={<AboutPage />} />
      <Route path={routesStatic.formations} element={<FormationsPage />} />
      <Route path={routesStatic.formationDetail} element={<FormationDetailPage />} />
      <Route path={routesStatic.actualites} element={<ActualitesPage />} />
      <Route path={routesStatic.actualiteDetail} element={<ActualiteDetailPage />} />
      <Route path={routesStatic.partenaires} element={<PartenairesPage />} />
      <Route path={routesStatic.partenaireDetail} element={<PartenaireDetailPage />} />
      <Route path={routesStatic.ressourcesHumaines} element={<RessourcesHumainesPage />} />
      <Route path={routesStatic.ressourceHumaineDetail} element={<RessourceHumaineDetailPage />} />
      <Route path={routesStatic.projets} element={<ProjetsPage />} />
      <Route path={routesStatic.projetDetail} element={<ProjetDetailPage />} />
      <Route path={routesStatic.faq} element={<FaqPage />} />
      <Route path={routesStatic.admission} element={<AdmissionPage />} />
      <Route path={routesStatic.contact} element={<ContactPage />} />
      <Route path={routesStatic.mentionsLegales} element={<MentionsLegalesPage />} />
      <Route
        path={routesStatic.politiqueConfidentialite}
        element={<PolitiqueConfidentialitePage />}
      />
    </Routes>
  </Suspense>
);

export default AppRoutes;
