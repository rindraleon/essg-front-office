import { isDisposableEmail, isValidEmail, normalizeEmail } from './email';
import { validationMessages as msg } from './messages';
import {
  ADDRESS_REGEX,
  BAC_NUMBER_REGEX,
  BAC_YEAR_REGEX,
  BORDEREAU_REGEX,
  DIPLOMA_YEAR_MIN,
  EMAIL_MAX_LENGTH,
  FIELD_LIMITS,
  PERSON_NAME_REGEX,
  PLACE_NAME_REGEX,
  currentYear,
  isValidPhoneNumber,
} from './rules';

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.nomRequired;
  if (!PERSON_NAME_REGEX.test(trimmed)) return msg.nomInvalid;
  if (trimmed.length > FIELD_LIMITS.nameMaxLength) return msg.nomTooLong;
  return undefined;
}

export function validateFirstName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!PERSON_NAME_REGEX.test(trimmed)) return msg.prenomInvalid;
  if (trimmed.length > FIELD_LIMITS.nameMaxLength) return msg.prenomTooLong;
  return undefined;
}

export function validateNationality(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.nationalityRequired;
  if (!PERSON_NAME_REGEX.test(trimmed)) return msg.nationalityInvalid;
  if (trimmed.length > FIELD_LIMITS.nameMaxLength) return msg.nationalityRequired;
  return undefined;
}

export function validateBirthPlace(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.birthPlaceRequired;
  if (!PLACE_NAME_REGEX.test(trimmed)) return msg.birthPlaceInvalid;
  if (trimmed.length > FIELD_LIMITS.placeMaxLength) return msg.birthPlaceInvalid;
  return undefined;
}

export function validateExamCenter(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.examCenterInvalid;
  if (!PLACE_NAME_REGEX.test(trimmed)) return msg.examCenterInvalid;
  if (trimmed.length > 255) return msg.examCenterInvalid;
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const normalized = normalizeEmail(value);
  if (!normalized) return msg.emailRequired;
  if (normalized.length > EMAIL_MAX_LENGTH) return msg.emailTooLong;
  if (!isValidEmail(normalized)) return msg.emailInvalid;
  if (isDisposableEmail(normalized)) return msg.emailDisposable;
  return undefined;
}

export function validateOptionalEmail(value: string): string | undefined {
  return value.trim() ? validateEmail(value) : undefined;
}

export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.phoneInvalid;
  if (!isValidPhoneNumber(trimmed)) return msg.phoneInvalid;
  return undefined;
}

export function validateOptionalPhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return validatePhone(trimmed);
}

export function validateAddress(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.addressRequired;
  if (!ADDRESS_REGEX.test(trimmed)) return msg.addressInvalid;
  if (trimmed.length > FIELD_LIMITS.addressMaxLength) return msg.addressTooLong;
  return undefined;
}

export function validateBacNumber(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.bacNumberRequired;
  if (!/^\d+$/.test(trimmed)) return msg.bacNumberInvalid;
  if (!BAC_NUMBER_REGEX.test(trimmed)) return msg.bacNumberInvalid;
  return undefined;
}

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

export function validateOptionalDiplomaYear(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return validateBacYear(trimmed);
}

export function validateBordereau(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!BORDEREAU_REGEX.test(trimmed)) return msg.bordereauInvalid;
  if (trimmed.length > FIELD_LIMITS.bordereauMaxLength) return msg.bordereauTooLong;
  return undefined;
}

export function validateBirthDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.dateNaissanceRequired;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return msg.dateNaissanceRequired;
  if (date.getTime() >= Date.now()) return msg.dateNaissanceInvalid;
  if (date.getFullYear() < 1900) return msg.dateNaissanceTooOld;
  return undefined;
}

export function validateSujet(value: string): string | undefined {
  return value.trim() ? undefined : msg.sujetRequired;
}

export function validateMessage(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return msg.messageRequired;
  if (trimmed.length > FIELD_LIMITS.messageMaxLength) return msg.messageTooLong;
  return undefined;
}
