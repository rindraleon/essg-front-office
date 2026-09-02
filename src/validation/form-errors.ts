/**
 * Carte d'erreurs de formulaire : champ → message (`undefined` = pas d'erreur).
 * Type partagé par tous les formulaires (Contact, Admission).
 */
export type FormErrors<TField extends string = string> = Partial<Record<TField, string>>;
