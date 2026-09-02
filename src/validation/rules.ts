/**
 * Règles de validation — source unique partagée Contact + Admission.
 * Les limites reflètent les règles métier du backend (DTO class-validator)
 * afin que frontend et backend ne puissent jamais être contradictoires.
 */

/** Année la plus ancienne acceptée pour un diplôme (règle métier existante). */
export const DIPLOMA_YEAR_MIN = 1980;

/** Longueur maximale d'un numéro E.164 (sans le « + »). */
const E164_MAX_DIGITS = 15;
/** Longueur minimale d'un numéro international significatif. */
const E164_MIN_DIGITS = 8;

/** Limite email du backend (EMAIL_MAX_LENGTH). */
export const EMAIL_MAX_LENGTH = 50;

export const FIELD_LIMITS = {
  nameMaxLength: 100,
  placeMaxLength: 150,
  addressMaxLength: 255,
  emailMaxLength: EMAIL_MAX_LENGTH,
  phoneMaxLength: 20,
  bacNumberMinLength: 4,
  bacNumberMaxLength: 20,
  bordereauMaxLength: 15,
  messageMaxLength: 1000,
} as const;

export function currentYear(): number {
  return new Date().getFullYear();
}

/**
 * Nom / prénom : lettres (accents inclus), espaces, apostrophes (« ' » et « ’ »)
 * et traits d'union. Doit commencer et finir par une lettre.
 * Les chiffres, emojis et symboles arbitraires sont refusés.
 */
export const PERSON_NAME_REGEX = /^\p{L}(?:[\p{L}'’ -]*\p{L})?$/u;

/**
 * Noms de lieux (lieu de naissance, centre d'examen) : comme un nom, plus la
 * virgule et le point (ex. « Lycée Rabearivelo, Antananarivo »).
 */
export const PLACE_NAME_REGEX = /^\p{L}(?:[\p{L}'’ ,.-]*[\p{L}.])?$/u;

/**
 * Adresse postale (internationale ou malgache) : lettres, chiffres, espaces,
 * virgules, points, apostrophes, traits d'union, slash et parenthèses.
 */
export const ADDRESS_REGEX = /^[\p{L}0-9][\p{L}0-9\s,.'’\-/()]*$/u;

/**
 * Numéro de bordereau : alphanumérique avec séparateurs raisonnables
 * (espaces, - _ / .), comme le backend.
 */
export const BORDEREAU_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9\-_/.\s]*[A-Za-z0-9])?$/;

/**
 * Numéro d'inscription au baccalauréat : chiffres uniquement (4 à 20).
 */
export const BAC_NUMBER_REGEX = /^\d{4,20}$/;

/** Année d'obtention : exactement 4 chiffres. */
export const BAC_YEAR_REGEX = /^\d{4}$/;

/**
 * Syntaxe email : partie locale + domaine avec TLD d'au moins 2 lettres.
 * Refuse `test`, `test@`, `@gmail.com`, `test@gmail`, `test@@x.com`,
 * `test gmail.com`, `test@.com`.
 */
export const EMAIL_REGEX =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

/** Caractères acceptés pendant la saisie d'un téléphone : chiffres, espaces, « + » en tête. */
export function sanitizePhoneInput(value: string): string {
  let result = '';
  for (const char of value) {
    if (char === '+' && result === '') result = '+';
    else if (char >= '0' && char <= '9') result += char;
    else if (char === ' ' || char === '\u00A0') result += ' ';
  }
  return result;
}

/** Caractères acceptés pendant la saisie d'un numéro purement numérique (BAC, années). */
export function sanitizeDigitsInput(value: string, maxLength: number): string {
  let result = '';
  for (const char of value) {
    if (char >= '0' && char <= '9' && result.length < maxLength) result += char;
  }
  return result;
}

/** Nettoie les espaces (accidents de copier-coller) autour d'une valeur. */
export function trimValue(value: string): string {
  return value.trim();
}

/** Numéro international valide (hors « + ») : 8 à 15 chiffres, format MG contrôlé. */
export function isValidInternationalDigits(digits: string): boolean {
  if (digits.length < E164_MIN_DIGITS || digits.length > E164_MAX_DIGITS) return false;
  if (digits.startsWith('261')) return /^261[2-9]\d{8}$/.test(digits);
  return true;
}

/** Numéro national malgache valide : 0 suivi de 9 chiffres (ex. 0321234567). */
export function isValidNationalMgNumber(digits: string): boolean {
  return /^0[2-9]\d{8}$/.test(digits);
}

/**
 * Numéro de téléphone complet valide :
 * — national MG (0321234567) ;
 * — international (+261321234567, +33612345678…) ;
 * — préfixe « 00 » supporté (00261321234567).
 */
export function isValidPhoneNumber(value: string): boolean {
  const compact = value.replace(/\s+/g, '');
  if (!compact) return false;
  // Chiffres uniquement, avec au plus un « + » en tête.
  if (!/^\+?\d+$/.test(compact)) return false;
  if (compact.startsWith('+')) return isValidInternationalDigits(compact.slice(1));
  if (compact.startsWith('00')) {
    const rest = compact.slice(2);
    return /^\d+$/.test(rest) && isValidInternationalDigits(rest);
  }
  if (/^\d+$/.test(compact)) return isValidNationalMgNumber(compact);
  return false;
}

/** Normalisation envoyée à l'API : trim + espaces simples (le backend canonicalise en +261…). */
export function normalizePhoneForApi(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/** Normalisation email envoyée à l'API : trim + minuscules (miroir du backend). */
export function normalizeEmailForApi(value: string): string {
  return value.trim().toLowerCase();
}
