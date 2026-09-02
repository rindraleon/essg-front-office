// Point d'entrée unique des exports du répertoire « validation ».
export { validationMessages } from './messages';
export type { FormErrors } from './form-errors';
export {
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
  isValidInternationalDigits,
  isValidNationalMgNumber,
  isValidPhoneNumber,
  normalizeEmailForApi,
  normalizePhoneForApi,
  sanitizeDigitsInput,
  sanitizePhoneInput,
} from './rules';
export {
  validateAddress,
  validateBacNumber,
  validateBacYear,
  validateBirthDate,
  validateBirthPlace,
  validateBordereau,
  validateEmail,
  validateExamCenter,
  validateFirstName,
  validateMessage,
  validateName,
  validateNationality,
  validateOptionalDiplomaYear,
  validateOptionalPhone,
  validatePhone,
  validateSujet,
} from './validators';
export {
  normalizeContactPayload,
  validateContactField,
  validateContactForm,
  type ContactFormField,
} from './contact-form.validation';
export {
  bacStepErrors,
  documentStepErrors,
  formationStepErrors,
  normalizeAdmissionPayloadData,
  personalStepErrors,
  type AdmissionField,
  type AdmissionFiles,
} from './admission-form.validation';
export { mapApiErrorToFormErrors, type MappedApiErrors } from './api-error.mapper';
