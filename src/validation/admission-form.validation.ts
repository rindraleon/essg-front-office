/**
 * Validation du formulaire d'admission — reprend les étapes existantes
 * (identité, bac, formation, pièces jointes) en réutilisant les validateurs
 * partagés avec le formulaire de contact.
 */
import type { AdmissionProgram } from '@/config';
import type { AdmissionDocumentKind, AdmissionFormData } from '@/types';
import type { FormErrors } from './form-errors';
import { validationMessages as msg } from './messages';
import {
  validateAddress,
  validateBacNumber,
  validateBacYear,
  validateBirthDate,
  validateBirthPlace,
  validateBordereau,
  validateEmail,
  validateExamCenter,
  validateFirstName,
  validateName,
  validateNationality,
  validateOptionalDiplomaYear,
  validatePhone,
} from './validators';

export type AdmissionField = keyof AdmissionFormData;
export type AdmissionFiles = Partial<Record<AdmissionDocumentKind, File>>;
export type { FormErrors };

const REQUIRED_MESSAGE = msg.required;

function requiredError(value: string | undefined): string | undefined {
  return value && value.trim() ? undefined : REQUIRED_MESSAGE;
}

/** Étape 1 — Informations personnelles. */
export function personalStepErrors(data: AdmissionFormData): FormErrors {
  const errors: FormErrors = {};
  const checks: Array<[AdmissionField, (value: string) => string | undefined]> = [
    ['nom', validateName],
    ['prenom', validateFirstName],
    ['dateNaissance', validateBirthDate],
    ['lieuNaissance', validateBirthPlace],
    ['nationalite', validateNationality],
    ['sexe', requiredError],
    ['adresse', validateAddress],
    ['telephone', validatePhone],
    ['email', validateEmail],
  ];
  checks.forEach(([field, validate]) => {
    const error = validate(data[field] as string);
    if (error) errors[field] = error;
  });
  return errors;
}

/** Étape 2 — Informations sur le baccalauréat. */
export function bacStepErrors(data: AdmissionFormData): FormErrors {
  const errors: FormErrors = {};
  const checks: Array<[AdmissionField, (value: string) => string | undefined]> = [
    ['bacType', requiredError],
    ['bacSerie', requiredError],
    ['numeroBaccalaureat', validateBacNumber],
    ['bacAnneeObtention', validateBacYear],
    ['bacCentreExamen', validateExamCenter],
  ];
  checks.forEach(([field, validate]) => {
    const error = validate(data[field] as string);
    if (error) errors[field] = error;
  });
  if (!data.bacCategorie) errors.bacSerie = 'Sélectionnez une série valide';
  return errors;
}

/** Étape 3 — Formation souhaitée (+ études antérieures pour le Master). */
export function formationStepErrors(
  data: AdmissionFormData,
  eligiblePrograms: readonly AdmissionProgram[]
): FormErrors {
  const errors: FormErrors = {};
  const checks: Array<[AdmissionField, (value: string) => string | undefined]> = [
    ['niveau', requiredError],
    ['mention', requiredError],
    ['parcours', requiredError],
  ];
  if (data.niveau === 'master') {
    checks.push(['ancienEtablissement', requiredError], ['numeroMatricule', requiredError]);
  }
  checks.forEach(([field, validate]) => {
    const error = validate(data[field] as string);
    if (error) errors[field] = error;
  });
  if (data.licenceAnneeObtention) {
    const error = validateOptionalDiplomaYear(data.licenceAnneeObtention);
    if (error) errors.licenceAnneeObtention = error;
  }
  const eligible = eligiblePrograms.some(
    (program) => program.mentionId === data.mention && program.parcoursId === data.parcours
  );
  if (!eligible)
    errors.eligibility = "La formation choisie n'est pas compatible avec votre profil.";
  return errors;
}

/** Étape 4 — Pièces jointes et conditions. */
export function documentStepErrors(
  data: AdmissionFormData,
  files: AdmissionFiles,
  requiredDocumentIds: readonly AdmissionDocumentKind[]
): FormErrors {
  const errors: FormErrors = {};
  requiredDocumentIds.forEach((kind) => {
    if (!files[kind]) errors[kind] = 'Cette pièce est obligatoire';
  });
  const bordereauError = validateBordereau(data.numeroBordereau);
  if (bordereauError) errors.numeroBordereau = bordereauError;
  if (!data.accepteConditions) errors.accepteConditions = 'Veuillez accepter les conditions';
  return errors;
}

/** Normalise les données texte juste avant la construction du payload. */
export function normalizeAdmissionPayloadData(data: AdmissionFormData): AdmissionFormData {
  const normalized: Record<string, unknown> = { ...data };
  (Object.keys(data) as AdmissionField[]).forEach((field) => {
    const value = data[field];
    if (typeof value === 'string') {
      let next = value.trim();
      if (field === 'email') next = next.toLowerCase();
      if (field === 'telephone') next = next.replace(/\s+/g, ' ');
      normalized[field] = next;
    }
  });
  return normalized as AdmissionFormData;
}
