/**
 * Convention d'affichage des personnes — source unique du frontend.
 *
 * Miroir exact de `back-office/src/utils/name.utils.ts` : la règle « Nom
 * Prénom » doit être identique côté public et côté administration, sans quoi
 * une même personne apparaîtrait sous deux libellés selon l'interface.
 */

interface PersonLike {
  nom?: string | null;
  prenom?: string | null;
}

/** « Nom Prénom », sans espace superflu si l'une des deux valeurs manque. */
export function formatFullName(person: PersonLike | null | undefined): string {
  if (!person) return '';
  return [person.nom, person.prenom]
    .map((part) => (part ?? '').trim())
    .filter(Boolean)
    .join(' ');
}

/** Initiales dans le même ordre que l'affichage : N puis P, deux caractères. */
export function getPersonInitials(person: PersonLike | null | undefined): string {
  if (!person) return '';
  const nom = (person.nom ?? '').trim();
  const prenom = (person.prenom ?? '').trim();
  return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase() || nom.charAt(0).toUpperCase();
}
