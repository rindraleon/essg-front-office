import { ApiError } from '@/api';
import { validationMessages as msg } from './messages';

type FieldMatcher = { field: string; pattern: RegExp };

const FIELD_MATCHERS: readonly FieldMatcher[] = [
  { field: 'email', pattern: /\bemail\b/i },
  { field: 'telephone', pattern: /t[eé]l[eé]phone/i },
  { field: 'numeroBordereau', pattern: /bordereau/i },
  { field: 'numeroBaccalaureat', pattern: /baccalaur[eé]at/i },
  { field: 'bacAnneeObtention', pattern: /ann[eé]e d'obtention|ann[eé]e d’obtention/i },
  { field: 'bacCentreExamen', pattern: /centre d'examen|centre d’examen/i },
  { field: 'lieuNaissance', pattern: /lieu de naissance/i },
  { field: 'dateNaissance', pattern: /date de naissance/i },
  { field: 'nationalite', pattern: /nationalit[eé]/i },
  { field: 'adresse', pattern: /adresse/i },
  { field: 'nom', pattern: /\bnom\b/i },
  { field: 'prenom', pattern: /pr[eé]nom/i },
];

export type MappedApiErrors = {

  fieldErrors: Record<string, string>;

  globalMessage?: string;
};

function humanizeApiMessage(error: ApiError): string | undefined {
  if (error.kind === 'network') return error.message;
  if (error.kind === 'timeout') return error.message;
  if (error.kind === 'server' || error.kind === 'unknown') return msg.apiGeneric;
  const message = error.message?.trim();
  return message || msg.apiGeneric;
}

export function mapApiErrorToFormErrors(
  error: unknown,
  knownFields: readonly string[]
): MappedApiErrors {
  if (!(error instanceof ApiError)) {
    return { fieldErrors: {}, globalMessage: msg.apiGeneric };
  }

  const globalMessage = humanizeApiMessage(error);
  if (error.kind === 'server' || error.kind === 'unknown') {
    return { fieldErrors: {}, globalMessage };
  }

  const known = new Set(knownFields);
  const fieldErrors: Record<string, string> = {};
  const message = error.message ?? '';

  const matcher = FIELD_MATCHERS.find(
    ({ field, pattern }) => known.has(field) && pattern.test(message)
  );
  if (matcher) {
    fieldErrors[matcher.field] = message;
  }

  return { fieldErrors, globalMessage };
}
