import { describe, expect, it } from 'vitest';
import { ApiError } from '@/api';
import { mapApiErrorToFormErrors } from './api-error.mapper';

describe('mapApiErrorToFormErrors', () => {
  const fields = ['nom', 'email', 'telephone', 'message'];

  it('rattache une erreur email au champ email', () => {
    const error = new ApiError("L'adresse email saisie est invalide.", {
      statusCode: 400,
      kind: 'validation',
    });
    const { fieldErrors, globalMessage } = mapApiErrorToFormErrors(error, fields);
    expect(fieldErrors.email).toContain('email');
    expect(globalMessage).toBeDefined();
  });

  it('rattache une erreur téléphone au champ telephone', () => {
    const error = new ApiError('Numéro de téléphone invalide.', {
      statusCode: 400,
      kind: 'validation',
    });
    const { fieldErrors } = mapApiErrorToFormErrors(error, fields);
    expect(fieldErrors.telephone).toBeDefined();
  });

  it('ne rattache pas un champ absent du formulaire courant', () => {
    const error = new ApiError('Le numéro de bordereau est déjà utilisé.', {
      statusCode: 409,
      kind: 'conflict',
    });
    const { fieldErrors } = mapApiErrorToFormErrors(error, ['nom', 'email']);
    expect(fieldErrors).toEqual({});
  });

  it('produit un message global compréhensible pour une erreur serveur', () => {
    const error = new ApiError('Internal server error: ECONNREFUSED 127.0.0.1:5432', {
      statusCode: 500,
      kind: 'server',
    });
    const { fieldErrors, globalMessage } = mapApiErrorToFormErrors(error, fields);
    expect(fieldErrors).toEqual({});
    expect(globalMessage).not.toContain('ECONNREFUSED');
    expect(globalMessage).not.toContain('127.0.0.1');
  });

  it('reste robuste pour une erreur inconnue', () => {
    const { globalMessage } = mapApiErrorToFormErrors(new Error('boom'), fields);
    expect(globalMessage).toBeDefined();
  });
});
