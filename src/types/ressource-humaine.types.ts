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
