import heroImage from '../assets/files/images/background/Hero.webp';
import campusVueEnsemble from '../assets/files/images/campus/campus-vue-ensemble.webp';
import campusVillePerchee from '../assets/files/images/campus/campus-ville-perchee.webp';
import campusRelief from '../assets/files/images/campus/campus-relief.webp';
import campusBelvedere from '../assets/files/images/campus/campus-belvedere.webp';

export const SITE_HERO_IMAGE = heroImage;

export const SITE_HERO_ALT =
  "Vue aérienne du campus de l'ESSG à Fianarantsoa : le bâtiment pédagogique et ses abords boisés";

export interface CampusImage {
  src: string;
  alt: string;
}

export const CAMPUS_GALLERY: CampusImage[] = [
  { src: campusVueEnsemble, alt: "Vue d'ensemble du campus et de son environnement" },
  { src: campusVillePerchee, alt: 'Le campus et la ville historique en surplomb' },
  { src: campusRelief, alt: 'Relief et vallée, terrain d’étude en géomatique' },
  { src: campusBelvedere, alt: 'Belvédère et abords aménagés du campus' },
];

// Héros différenciés par rubrique — même cohérence, teinte/motif distinct
export const HERO_IMAGES = {
  home: heroImage,
  about: campusVueEnsemble,
  formations: campusRelief,
  actualites: campusVillePerchee,
  partenaires: campusBelvedere,
  projets: campusRelief,
  ressourcesHumaines: campusVueEnsemble,
  admission: campusBelvedere,
  contact: campusVillePerchee,
  faq: campusVueEnsemble,
  legal: heroImage,
} as const;

export const HERO_OVERLAYS = {
  home: 'from-ink-950/70 via-ink-950/34 to-ink-950/80',
  about: 'from-ink-950/72 via-ink-950/38 to-ink-950/82',
  formations: 'from-brand-950/78 via-ink-950/45 to-ink-950/78',
  actualites: 'from-ink-950/68 via-brand-900/35 to-ink-950/78',
  partenaires: 'from-ink-950/70 via-ink-950/30 to-brand-950/60',
  projets: 'from-ink-900/70 via-ink-950/40 to-ink-950/85',
  ressourcesHumaines: 'from-ink-950/72 via-ink-950/42 to-ink-950/80',
  admission: 'from-brand-950/80 via-ink-950/45 to-ink-950/80',
  contact: 'from-ink-950/68 via-ink-950/35 to-brand-900/40',
  faq: 'from-ink-950/70 via-ink-950/38 to-ink-950/80',
  legal: 'from-ink-950/70 via-ink-950/40 to-ink-950/80',
} as const;
