import heroImage from '../assets/files/images/background/Hero.webp';
import campusVueEnsemble from '../assets/files/images/campus/campus-vue-ensemble.webp';
import campusVillePerchee from '../assets/files/images/campus/campus-ville-perchee.webp';
import campusRelief from '../assets/files/images/campus/campus-relief.webp';
import campusBelvedere from '../assets/files/images/campus/campus-belvedere.webp';

export const SITE_HERO_IMAGE = heroImage;

export const SITE_HERO_ALT = 'Campus ESSG — École Supérieure de Sciences Géomatiques';

export interface CampusImage {
  src: string;
  alt: string;
}

/**
 * Galerie « Notre campus en images » (page À propos).
 *
 * Ces visuels sont des recadrages locaux du panorama de marque
 * (`background/Hero.webp`, 7845 × 5233 px). Ils remplacent quatre URLs
 * Unsplash distantes qui posaient trois problèmes :
 *  - dépendance à un service tiers (rupture d'affichage s'il est indisponible
 *    ou bloqué par un pare-feu / une politique réseau) ;
 *  - photos génériques sans rapport avec l'ESSG ;
 *  - poids et latence non maîtrisés, en dehors du budget de la page.
 *
 * Chaque vue est cadrée en 4:3 (900 × 675 px, 72–148 Ko) pour correspondre
 * exactement au format d'affichage de la grille, sans redimensionnement
 * inutile côté navigateur.
 */
export const CAMPUS_GALLERY: CampusImage[] = [
  { src: campusVueEnsemble, alt: "Vue d'ensemble du campus et de son environnement" },
  { src: campusVillePerchee, alt: 'Le campus et la ville historique en surplomb' },
  { src: campusRelief, alt: 'Relief et vallée, terrain d’étude en géomatique' },
  { src: campusBelvedere, alt: 'Belvédère et abords aménagés du campus' },
];
