import type { ContactFormData } from '@/types';
import type { FormErrors } from './form-errors';
import {
  validateEmail,
  validateFirstName,
  validateMessage,
  validateName,
  validateOptionalPhone,
  validateSujet,
} from './validators';

export type ContactFormField = keyof ContactFormData;
export type { FormErrors };

export function validateContactField(field: ContactFormField, value: string): string | undefined {
  switch (field) {
    case 'nom':
      return validateName(value);
    case 'prenom':
      return validateFirstName(value);
    case 'email':
      return validateEmail(value);
    case 'telephone':
      return validateOptionalPhone(value);
    case 'sujet':
      return validateSujet(value);
    case 'message':
      return validateMessage(value);
    default:
      return undefined;
  }
}

export function validateContactForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};
  (Object.keys(data) as ContactFormField[]).forEach((field) => {
    const error = validateContactField(field, data[field]);
    if (error) errors[field] = error;
  });
  return errors;
}

export function normalizeContactPayload(data: ContactFormData): ContactFormData {
  return {
    nom: data.nom.trim(),
    prenom: data.prenom.trim(),
    email: data.email.trim().toLowerCase(),
    telephone: data.telephone.trim().replace(/\s+/g, ' '),
    sujet: data.sujet.trim(),
    message: data.message.trim(),
  };
}
