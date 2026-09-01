export function toErrorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message;
  return error ? 'Erreur inconnue' : null;
}

export function toError(error: unknown): Error | null {
  if (error instanceof Error) return error;
  return error ? new Error('Erreur inconnue') : null;
}
