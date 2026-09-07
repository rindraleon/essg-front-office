export const DIPLOMA_YEAR_MIN = 1980;

const E164_MAX_DIGITS = 15;

const E164_MIN_DIGITS = 8;

export { EMAIL_MAX_LENGTH } from './email';
import { EMAIL_MAX_LENGTH } from './email';

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

export const PERSON_NAME_REGEX = /^\p{L}(?:[\p{L}'’ -]*\p{L})?$/u;

export const PLACE_NAME_REGEX = /^\p{L}(?:[\p{L}'’ ,.-]*[\p{L}.])?$/u;

export const ADDRESS_REGEX = /^[\p{L}0-9][\p{L}0-9\s,.'’\-/()]*$/u;

export const BORDEREAU_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9\-_/.\s]*[A-Za-z0-9])?$/;

export const BAC_NUMBER_REGEX = /^\d{4,20}$/;

export const BAC_YEAR_REGEX = /^\d{4}$/;

export { EMAIL_REGEX } from './email';

export function sanitizePhoneInput(value: string): string {
  let result = '';
  for (const char of value) {
    if (char === '+' && result === '') result = '+';
    else if (char >= '0' && char <= '9') result += char;
    else if (char === ' ' || char === '\u00A0') result += ' ';
  }
  return result;
}

export function sanitizeDigitsInput(value: string, maxLength: number): string {
  let result = '';
  for (const char of value) {
    if (char >= '0' && char <= '9' && result.length < maxLength) result += char;
  }
  return result;
}

export function trimValue(value: string): string {
  return value.trim();
}

export function isValidInternationalDigits(digits: string): boolean {
  if (digits.length < E164_MIN_DIGITS || digits.length > E164_MAX_DIGITS) return false;
  if (digits.startsWith('261')) return /^261[2-9]\d{8}$/.test(digits);
  return true;
}

export function isValidNationalMgNumber(digits: string): boolean {
  return /^0[2-9]\d{8}$/.test(digits);
}

export function isValidPhoneNumber(value: string): boolean {
  const compact = value.replace(/\s+/g, '');
  if (!compact) return false;

  if (!/^\+?\d+$/.test(compact)) return false;
  if (compact.startsWith('+')) return isValidInternationalDigits(compact.slice(1));
  if (compact.startsWith('00')) {
    const rest = compact.slice(2);
    return /^\d+$/.test(rest) && isValidInternationalDigits(rest);
  }
  if (/^\d+$/.test(compact)) return isValidNationalMgNumber(compact);
  return false;
}

export function normalizePhoneForApi(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeEmailForApi(value: string): string {
  return value.trim().toLowerCase();
}
