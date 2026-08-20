export type FormationMention = {
  code: string;
  label: string;
  titres: readonly string[];
};

export const FORMATION_MENTIONS: readonly FormationMention[] = [
  {
    code: 'geomatique-et-applications',
    label: 'GÉOMATIQUE ET APPLICATIONS',
    titres: [
      'Géomatique et agriculture durable',
      'Géomatique et santé',
      'Géomatique, ressources naturelles et assainissement',
      'Cartographie numérique et développement',
    ],
  },
  {
    code: 'geomatique-et-management',
    label: 'GÉOMATIQUE ET MANAGEMENT',
    titres: [
      "Géomatique pour l'équité-genre",
      'Géomatique et économie',
      'Géomatique et bonne gouvernance',
      'Géomatique, communication et marketing',
      'Géo-entreprenariat',
    ],
  },
  {
    code: 'informatique-et-donnees-spatiales',
    label: 'INFORMATIQUE ET DONNÉES SPATIALES',
    titres: [
      "Système d'Information Géomatique et Décision",
      "Ingénierie Géospatiale et Technologie d'Informations",
      'Géomatique et Intelligence Artificielle',
      'Télédétection et SIG',
    ],
  },
] as const;
