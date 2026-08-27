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
