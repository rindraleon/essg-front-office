/**
 * Props d'accessibilité pour les champs de formulaire :
 * `aria-invalid` + `aria-describedby` pointant vers le message d'erreur.
 */
export function fieldA11yProps(
  id: string,
  error?: string
): { 'aria-invalid': true | undefined; 'aria-describedby': string | undefined } {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  };
}
