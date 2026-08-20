export interface Formation {
  id: number;
  slug: string;
  /** Mention / domaine (niveau 1 de la hiérarchie pédagogique ESSG). */
  mention?: string;
  /** @deprecated Aligné sur [mention] par le backend. */
  domaine: string[];
  titre: string;
  niveau: 'Licence' | 'Master' | 'Doctorat';
  duree: string;
  description: string;
  objectifs: string[];
  debouches: string[];
  image: string;
  enVedette: boolean;
  creeLe?: string;
  misAJourLe?: string;
  credits?: number;
  responsable?: string;
  /** Ressource humaine responsable — permet le lien vers sa fiche. */
  responsableId?: number | null;
  email?: string;
  conditions?: string[];
  competences?: string[];
  /**
   * Programme de la formation : une entrée par module ou unité
   * d'enseignement. C'est le champ alimenté par le back-office.
   */
  programme?: string[];
  /**
   * @deprecated Remplacé par `programme`. Conservé en lecture seule pour les
   * formations historiques dont le programme était structuré par semestre ;
   * le back-office ne l'alimente plus.
   */
  modules?: FormationModule[];
}

export type { PaginatedResult as PaginationResponse } from '@/api/types/api';

export type FormationModule = {
  semestre: string;
  cours: string[];
};

export type FormationItem = {
  id: number;
  titre: string;
  niveau: string;
  domaine: string[];
  duree: string;
  credits?: number;
  description: string;
  objectifs: string[];
  debouches: string[];
  programme?: string[];
  /** @deprecated Voir `Formation.modules`. */
  modules?: FormationModule[];
  conditions?: string[];
  competences?: string[];
  responsable?: string;
  email?: string;
};

export type FormationCardProps = {
  formation: Formation;
  detailLinkBase?: string;
  applyLink?: string;
};

export type FormationDetailContentProps = {
  formation: Formation;
};

export type FormationsPageProps = {
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
  formations?: Formation[];
};

export type FormationDetailPageProps = {
  formations?: Formation[];
};

export type FeaturedFormationsSectionProps = {
  title?: string;
  description?: string;
  featuredFormations?: Formation[];
};
