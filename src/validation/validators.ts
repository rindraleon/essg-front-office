/**
 * Validateurs réutilisables — chaque fonction retourne `undefined` quand la
 * valeur est valide, sinon un message d'erreur en français.
 * Utilisés à la fois par le formulaire Contact et le formulaire Admission.
 */
import { validationMessages as msg } from './messages';
import {
  ADDRESS_REGEX,
  BAC_NUMBER_REGEX,
  BAC_YEAR_REGEX,
  BORDEREAU_REGEX,
  DIPLOMA_YEAR_MIN,
  EMAIL_MAX_LENGTH,
  EMAIL_REGEX,
  FIELD_LIMITS,
  PERSON_NAME_REGEX,
  PLACE_NAME_REGEX,
  currentYear,
  isValidPhoneNumber,
} from './rules';

/** NOM — obligatoire : lettres, espaces, apostrophes, traits d'union. */
export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.nomRequired;
  if (!PERSON_NAME_REGEX.test(trimmed)) return msg.nomInvalid;
  if (trimmed.length > FIELD_LIMITS.nameMaxLength) return msg.nomTooLong;
  return undefined;
}

/** PRÉNOM — facultatif : mêmes règles que le nom, vide = valide. */
export function validateFirstName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!PERSON_NAME_REGEX.test(trimmed)) return msg.prenomInvalid;
  if (trimmed.length > FIELD_LIMITS.nameMaxLength) return msg.prenomTooLong;
  return undefined;
}

/** NATIONALITÉ — obligatoire : lettres, espaces, apostrophes, traits d'union. */
export function validateNationality(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.nationalityRequired;
  if (!PERSON_NAME_REGEX.test(trimmed)) return msg.nationalityInvalid;
  if (trimmed.length > FIELD_LIMITS.nameMaxLength) return msg.nationalityRequired;
  return undefined;
}

/** LIEU DE NAISSANCE — obligatoire : nom de lieu réaliste. */
export function validateBirthPlace(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.birthPlaceRequired;
  if (!PLACE_NAME_REGEX.test(trimmed)) return msg.birthPlaceInvalid;
  if (trimmed.length > FIELD_LIMITS.placeMaxLength) return msg.birthPlaceInvalid;
  return undefined;
}

/** CENTRE D'EXAMEN — même logique que le lieu de naissance. */
export function validateExamCenter(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.examCenterInvalid;
  if (!PLACE_NAME_REGEX.test(trimmed)) return msg.examCenterInvalid;
  if (trimmed.length > 255) return msg.examCenterInvalid;
  return undefined;
}

/** EMAIL — obligatoire : syntaxe sérieuse + longueur alignée sur le backend. */
export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.emailRequired;
  if (trimmed.length > EMAIL_MAX_LENGTH) return msg.emailTooLong;
  if (!EMAIL_REGEX.test(trimmed) || trimmed.includes(' ')) return msg.emailInvalid;
  return undefined;
}

/** TÉLÉPHONE — format malgache ou international strict. */
export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.phoneInvalid;
  if (!isValidPhoneNumber(trimmed)) return msg.phoneInvalid;
  return undefined;
}

/** TÉLÉPHONE facultatif (formulaire Contact) : vide = valide. */
export function validateOptionalPhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return validatePhone(trimmed);
}

/** ADRESSE — souple (internationale ou malgache) : lettres, chiffres, , . ' - / ( ). */
export function validateAddress(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.addressRequired;
  if (!ADDRESS_REGEX.test(trimmed)) return msg.addressInvalid;
  if (trimmed.length > FIELD_LIMITS.addressMaxLength) return msg.addressTooLong;
  return undefined;
}

/** NUMÉRO D'INSCRIPTION AU BAC — chiffres uniquement (4 à 20). */
export function validateBacNumber(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.bacNumberRequired;
  if (!/^\d+$/.test(trimmed)) return msg.bacNumberInvalid;
  if (!BAC_NUMBER_REGEX.test(trimmed)) return msg.bacNumberInvalid;
  return undefined;
}

/** ANNÉE D'OBTENTION — exactement 4 chiffres, plage métier cohérente. */
export function validateBacYear(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.bacYearRequired;
  if (!BAC_YEAR_REGEX.test(trimmed)) return msg.bacYearInvalid;
  const year = Number(trimmed);
  if (year < DIPLOMA_YEAR_MIN || year > currentYear()) {
    return msg.bacYearRange(DIPLOMA_YEAR_MIN, currentYear());
  }
  return undefined;
}

/** ANNÉE D'OBTENTION D'UN DIPLÔME (Licence) — facultative, mêmes règles. */
export function validateOptionalDiplomaYear(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return validateBacYear(trimmed);
}

/** NUMÉRO DE BORDEREAU — facultatif : alphanumérique + séparateurs raisonnables. */
export function validateBordereau(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!BORDEREAU_REGEX.test(trimmed)) return msg.bordereauInvalid;
  if (trimmed.length > FIELD_LIMITS.bordereauMaxLength) return msg.bordereauTooLong;
  return undefined;
}

/** DATE DE NAISSANCE — obligatoire, antérieure à aujourd'hui, plausible. */
export function validateBirthDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.dateNaissanceRequired;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return msg.dateNaissanceRequired;
  if (date.getTime() >= Date.now()) return msg.dateNaissanceInvalid;
  if (date.getFullYear() < 1900) return msg.dateNaissanceTooOld;
  return undefined;
}

/** SUJET (Contact) — obligatoire. */
export function validateSujet(value: string): string | undefined {
  return value.trim() ? undefined : msg.sujetRequired;
}

/** MESSAGE (Contact) — obligatoire, 1000 caractères max. */
export function validateMessage(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.messageRequired;
  if (trimmed.length > FIELD_LIMITS.messageMaxLength) return msg.messageTooLong;
  return undefined;
}
