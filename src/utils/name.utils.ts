interface PersonLike {
  nom?: string | null;
  prenom?: string | null;
}

export function formatFullName(person: PersonLike | null | undefined): string {
  if (!person) return '';
  return [person.nom, person.prenom]
    .map((part) => (part ?? '').trim())
    .filter(Boolean)
    .join(' ');
}

export function getPersonInitials(person: PersonLike | null | undefined): string {
  if (!person) return '';
  const nom = (person.nom ?? '').trim();
  const prenom = (person.prenom ?? '').trim();
  return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase() || nom.charAt(0).toUpperCase();
}
