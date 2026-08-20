/** Une ligne d'expérience professionnelle du parcours. */
export interface ExperienceProfessionnelle {
  poste: string;
  organisation?: string;
  periode?: string;
}

export interface RessourceHumaine {
  id: number;
  slug: string;
  nom: string;
  prenom: string;
  poste: string;
  description?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  photo?: string;
  actif: boolean;
  ordre: number;

  /* ── Parcours structuré ──
     Ces champs sont renvoyés par l'API depuis l'ajout de l'import de CV.
     Ils manquaient au type frontend, si bien que la page de détail ne
     pouvait pas les exploiter : les données arrivaient mais restaient
     invisibles. */
  experiences?: ExperienceProfessionnelle[];
  formations?: string[];
  diplomes?: string[];
  competences?: string[];
  langues?: string[];

  creeLe: string;
  misAJourLe: string;
}

export interface RessourceHumaineSectionProps {
  title?: string;
  description?: string;
  ressourcesHumaines?: RessourceHumaine[];
}
