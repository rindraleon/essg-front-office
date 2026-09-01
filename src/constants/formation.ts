export const NIVEAU_ORDER = ['Licence', 'Master', 'Doctorat'] as const;

export type NiveauFormation = (typeof NIVEAU_ORDER)[number];
