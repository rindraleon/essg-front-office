/**
 * Hiérarchie des niveaux de formation.
 *
 * Miroir de l'énumération du backend
 * (`backend-essg/src/formations/entities/formation.entity.ts`, colonne
 * `niveau`, contrainte `@IsIn(['Licence', 'Master', 'Doctorat'])`).
 *
 * Cet ordre est **pédagogique**, pas alphabétique : un tri alphabétique
 * donnerait « Doctorat, Licence, Master », ce qui ne correspond à aucune
 * progression réelle. Il sert à la fois au tri des cartes et à l'ordre des
 * options de filtre, garantissant que les deux concordent.
 */
export const NIVEAU_ORDER = ['Licence', 'Master', 'Doctorat'] as const;

export type NiveauFormation = (typeof NIVEAU_ORDER)[number];
