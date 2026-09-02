/**
 * Transformation centralisée des erreurs backend (ApiError) en erreurs de
 * formulaire : le message est rattaché au champ concerné lorsqu'il est
 * identifiable, sinon une notification globale claire est produite.
 * Aucun détail technique (stack trace, SQL, codes internes) n'est exposé.
 */
import { ApiError } from '@/api';
import { validationMessages as msg } from './messages';

type FieldMatcher = { field: string; pattern: RegExp };

/**
 * Mots-clés des messages backend (français) par champ.
 * Les libellés correspondent à ceux produits par le backend
 * (see: essg-backend — validation-messages.ts).
 */
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
  /** Erreurs rattachables à des champs du formulaire. */
  fieldErrors: Record<string, string>;
  /** Message global compréhensible (toast), toujours défini si une erreur existe. */
  globalMessage?: string;
};

function humanizeApiMessage(error: ApiError): string | undefined {
  if (error.kind === 'network') return error.message;
  if (error.kind === 'timeout') return error.message;
  if (error.kind === 'server' || error.kind === 'unknown') return msg.apiGeneric;
  const message = error.message?.trim();
  return message || msg.apiGeneric;
}

/**
 * Mappe une erreur API vers les champs du formulaire courant.
 * @param error erreur attrapée (ApiError ou inconnue)
 * @param knownFields champs réellement présents dans le formulaire —
 *        seuls ces champs peuvent recevoir une erreur
 */
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
