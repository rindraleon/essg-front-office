import { Compass, GraduationCap, Map } from 'lucide-react';
import { SITE_HERO_IMAGE } from '@/constants';
import Breadcrumb from '../common/Breadcrumb';
import PageHero from '../common/PageHero';

const HERO_STATS = [
  {
    value: '2026',
    label: 'Année de création',
    icon: <Compass className="mx-auto size-5 text-brand-300" />,
  },
  {
    value: '2',
    label: 'Cycles de formation',
    icon: <GraduationCap className="mx-auto size-5 text-brand-300" />,
  },
  {
    value: '1',
    label: 'Campus à Andrainjato',
    icon: <Map className="mx-auto size-5 text-brand-300" />,
  },
];

const AboutHero = () => (
  <>
    <PageHero
      image={SITE_HERO_IMAGE}
      imageAlt="Campus de l'École Supérieure de Sciences Géomatiques"
      title="À propos"
      description="L’ESSG forme une nouvelle génération de professionnels capables de convertir la donnée géographique en décisions utiles, durables et responsables."
      minHeight="72vh"
      stats={HERO_STATS}
    />
    <Breadcrumb items={[{ label: 'À propos' }]} />
  </>
);

export default AboutHero;
