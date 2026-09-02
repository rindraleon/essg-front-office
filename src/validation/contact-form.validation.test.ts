import { describe, expect, it } from 'vitest';
import type { ContactFormData } from '@/types';
import { normalizeContactPayload, validateContactForm } from './contact-form.validation';

const VALID: ContactFormData = {
  nom: 'RAKOTO',
  prenom: '',
  email: 'rindra@gmail.com',
  telephone: '',
  sujet: 'information',
  message: 'Bonjour, je souhaite des informations.',
};

describe('validateContactForm', () => {
  it('accepte un formulaire valide avec prénom et téléphone facultatifs vides', () => {
    expect(validateContactForm(VALID)).toEqual({});
  });

  it('signale tous les champs obligatoires manquants', () => {
    const errors = validateContactForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      sujet: '',
      message: '',
    });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'nom', 'sujet']);
  });

  it('valide le téléphone lorsqu’il est renseigné', () => {
    const errors = validateContactForm({ ...VALID, telephone: 'phone0321234567' });
    expect(errors.telephone).toBeDefined();
    expect(
      validateContactForm({ ...VALID, telephone: '+261 32 12 345 67' }).telephone
    ).toBeUndefined();
  });

  it('valide le prénom renseigné mais invalide', () => {
    expect(validateContactForm({ ...VALID, prenom: 'Rakoto123' }).prenom).toBeDefined();
  });
});

describe('normalizeContactPayload', () => {
  it('trim, minuscule l’email et resserre les espaces du téléphone', () => {
    const result = normalizeContactPayload({
      nom: '  RAKOTO ',
      prenom: ' Jean ',
      email: '  RINDRA@Gmail.COM ',
      telephone: '  032  12 345 67 ',
      sujet: ' information ',
      message: ' Bonjour ',
    });
    expect(result).toEqual({
      nom: 'RAKOTO',
      prenom: 'Jean',
      email: 'rindra@gmail.com',
      telephone: '032 12 345 67',
      sujet: 'information',
      message: 'Bonjour',
    });
  });
});
