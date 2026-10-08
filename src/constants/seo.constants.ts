/** Configuration SEO du site public ESSG (SPA) — titres, descriptions et images par route. */

export const SITE_NAME = 'ESSG';
export const SITE_FULL_NAME = 'École Supérieure des Sciences Géomatiques (ESSG)';

/** URL officielle du site — référence des canoniques, Open Graph et JSON-LD. */
export const SITE_URL_OFFICIELLE = 'https://essg.univ-fianarantsoa.mg';

const RAW_SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
const CONFIGURED_SITE_URL =
  RAW_SITE_URL && RAW_SITE_URL.endsWith('/') ? RAW_SITE_URL.slice(0, -1) : RAW_SITE_URL;

/**
 * Origine absolue du site (sans slash final) : VITE_SITE_URL si défini,
 * sinon l'URL officielle. Volontairement indépendant de `window.location`
 * pour que le canonique reste l'officiel sur les environnements de test.
 */
export const SITE_URL_ORIGIN = CONFIGURED_SITE_URL || SITE_URL_OFFICIELLE;

export const DEFAULT_TITLE = `${SITE_FULL_NAME}`;
export const DEFAULT_DESCRIPTION =
  "L'ESSG forme aux métiers de la géomatique, des systèmes d'information géographique et de l'information spatiale : licences, masters, doctorat, admissions et vie de campus.";
/** Image de partage par défaut (OG/Twitter) — chemin public ou absolu. */
export const DEFAULT_OG_IMAGE = '/EssG.png';

export interface PageSeoMeta {
  title?: string;
  description?: string;
  /** Chemin de la route (sans paramètre) pour laquelle ces métadonnées s'appliquent. */
  pattern: string;
}

/**
 * Métadonnées par défaut, par route connue. Les pages de détail
 * (préfixe + slug) héritent de l'entrée de leur section.
 */
export const PAGE_SEO: PageSeoMeta[] = [
  {
    pattern: '/',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  {
    pattern: '/about',
    title: `À propos | ${SITE_NAME}`,
    description: `Découvrez ${SITE_FULL_NAME} : mission, valeurs, campus, gouvernance et engagement pour la formation en sciences géomatiques.`,
  },
  {
    pattern: '/formations',
    title: `Formations | ${SITE_NAME}`,
    description:
      'Licences, masters et doctorat en géomatique, SIG, télédétection et intelligence artificielle : programmes, débouchés et conditions d’accès des formations ESSG.',
  },
  {
    pattern: '/formations/',
    title: `Formation | ${SITE_NAME}`,
    description:
      "Programme détaillé de la formation : objectifs, modules, débouchés, crédits et conditions d'accès.",
  },
  {
    pattern: '/actualites',
    title: `Actualités | ${SITE_NAME}`,
    description:
      "Toute l'actualité de l'ESSG : vie de l'école, événements, publications et réussites des étudiants et des équipes pédagogiques.",
  },
  {
    pattern: '/actualites/',
    title: `Actualité | ${SITE_NAME}`,
    description: `Actualité de ${SITE_FULL_NAME}.`,
  },
  {
    pattern: '/partenaires',
    title: `Partenaires | ${SITE_NAME}`,
    description:
      "Entreprises, universités et institutions partenaires de l'ESSG : stages, projets, chaires et coopérations au service de la géomatique.",
  },
  {
    pattern: '/partenaires/',
    title: `Partenaire | ${SITE_NAME}`,
    description: `Partenaire de ${SITE_FULL_NAME}.`,
  },
  {
    pattern: '/ressources-humaines',
    title: `Équipes pédagogiques | ${SITE_NAME}`,
    description:
      "Enseignants-chercheurs et personnels de l'ESSG : profils, spécialités et parcours académiques des équipes pédagogiques.",
  },
  {
    pattern: '/ressources-humaines/',
    title: `Membre de l'équipe | ${SITE_NAME}`,
    description: `Profil d'un membre des équipes de ${SITE_FULL_NAME}.`,
  },
  {
    pattern: '/projets',
    title: `Projets | ${SITE_NAME}`,
    description:
      "Projets scientifiques, étudiants et communautaires menés à l'ESSG : cartographie, télédétection, données géospatiales et innovation.",
  },
  {
    pattern: '/projets/',
    title: `Projet | ${SITE_NAME}`,
    description: `Projet mené à ${SITE_FULL_NAME}.`,
  },
  {
    pattern: '/faq',
    title: `FAQ | ${SITE_NAME}`,
    description:
      "Réponses aux questions fréquentes sur l'ESSG : admissions, formations, frais de scolarité, vie étudiante et diplômes.",
  },
  {
    pattern: '/admission',
    title: `Candidature | ${SITE_NAME}`,
    description:
      "Candidater à l'ESSG : pièces du dossier, calendrier des admissions en ligne et suivi de votre demande.",
  },
  {
    pattern: '/contact',
    title: `Contact | ${SITE_NAME}`,
    description: `Contacter ${SITE_FULL_NAME} : adresse du campus, téléphone, email et formulaire de message.`,
  },
  {
    pattern: '/mentions-legales',
    title: `Mentions légales | ${SITE_NAME}`,
    description: `Mentions légales du site de ${SITE_FULL_NAME}.`,
  },
  {
    pattern: '/politique-confidentialite',
    title: `Politique de confidentialité | ${SITE_NAME}`,
    description: `Politique de protection des données personnelles du site de ${SITE_FULL_NAME}.`,
  },
];

/** Entrée de correspondance : exacte d'abord, puis par préfixe (pages de détail). */
export function findPageSeo(pathname: string): PageSeoMeta | undefined {
  const exact = PAGE_SEO.find((entry) => entry.pattern === pathname);
  if (exact) return exact;
  const prefixed = PAGE_SEO.filter(
    (entry) => entry.pattern !== '/' && pathname.startsWith(entry.pattern)
  );
  prefixed.sort((a, b) => b.pattern.length - a.pattern.length);
  return prefixed[0];
}
