import { describe, expect, it } from 'vitest';
import type { AdmissionFormData } from '@/types';
import {
  bacStepErrors,
  documentStepErrors,
  formationStepErrors,
  normalizeAdmissionPayloadData,
  personalStepErrors,
} from './admission-form.validation';

const CURRENT_YEAR = new Date().getFullYear();

const VALID_PERSONAL: AdmissionFormData = {
  nom: 'RAKOTO',
  prenom: '',
  dateNaissance: '2000-05-12',
  lieuNaissance: 'Antananarivo',
  nationalite: 'Malgache',
  sexe: 'feminin',
  adresse: 'Lot II A 123, Andavamamba, Antananarivo 101, Madagascar',
  telephone: '0321234567',
  email: 'rindra@gmail.com',
  bacType: '',
  bacSerie: '',
  bacCategorie: '',
  numeroBaccalaureat: '',
  bacAnneeObtention: '',
  bacCentreExamen: '',
  niveau: '',
  mention: '',
  parcours: '',
  formation: '',
  diplomePrecedent: '',
  ancienEtablissement: '',
  numeroMatricule: '',
  licenceEtablissement: '',
  licenceMention: '',
  licenceAnneeObtention: '',
  numeroBordereau: '',
  accepteConditions: false,
};

describe('personalStepErrors (étape 1)', () => {
  it('accepte un prénom vide (facultatif)', () => {
    expect(personalStepErrors(VALID_PERSONAL)).toEqual({});
  });

  it('signale nom, email, téléphone et lieu de naissance invalides', () => {
    const errors = personalStepErrors({
      ...VALID_PERSONAL,
      nom: 'Rakoto123',
      email: 'test@',
      telephone: '03A1234567',
      lieuNaissance: 'Tana!',
    });
    expect(errors.nom).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.telephone).toBeDefined();
    expect(errors.lieuNaissance).toBeDefined();
  });

  it('signale les champs obligatoires vides', () => {
    const errors = personalStepErrors({ ...VALID_PERSONAL, sexe: '', adresse: '', nom: '' });
    expect(errors.sexe).toBeDefined();
    expect(errors.adresse).toBeDefined();
    expect(errors.nom).toBeDefined();
  });

  it('accepte une adresse internationale et un téléphone international', () => {
    const errors = personalStepErrors({
      ...VALID_PERSONAL,
      adresse: '12 Rue des Lilas, 75001 Paris, France',
      telephone: '+261 32 12 345 67',
    });
    expect(errors).toEqual({});
  });
});

describe('bacStepErrors (étape 2)', () => {
  const VALID_BAC: AdmissionFormData = {
    ...VALID_PERSONAL,
    bacType: 'general',
    bacSerie: 'd',
    bacCategorie: 'scientifique',
    numeroBaccalaureat: '123456789',
    bacAnneeObtention: String(CURRENT_YEAR),
    bacCentreExamen: 'Lycée Rabearivelo, Antananarivo',
  };

  it('accepte une étape Bac complète', () => {
    expect(bacStepErrors(VALID_BAC)).toEqual({});
  });

  it('refuse un numéro BAC non numérique', () => {
    expect(
      bacStepErrors({ ...VALID_BAC, numeroBaccalaureat: 'BAC-2026-012345' }).numeroBaccalaureat
    ).toBeDefined();
  });

  it('refuse une année à 2 chiffres ou hors plage', () => {
    expect(
      bacStepErrors({ ...VALID_BAC, bacAnneeObtention: '26' }).bacAnneeObtention
    ).toBeDefined();
    expect(
      bacStepErrors({ ...VALID_BAC, bacAnneeObtention: String(CURRENT_YEAR + 1) }).bacAnneeObtention
    ).toBeDefined();
  });
});

describe('formationStepErrors (étape 3)', () => {
  it('exige les études antérieures pour le master', () => {
    const errors = formationStepErrors(
      {
        ...VALID_PERSONAL,
        niveau: 'master',
        mention: 'geoinformatique',
        parcours: 'geomatique-teledetection',
      },
      []
    );
    expect(errors.ancienEtablissement).toBeDefined();
    expect(errors.numeroMatricule).toBeDefined();
    expect(errors.eligibility).toBeDefined();
  });
});

describe('documentStepErrors (étape 4)', () => {
  it('signale les pièces manquantes et les conditions non acceptées', () => {
    const errors = documentStepErrors(VALID_PERSONAL, {}, ['releveBac', 'photoIdentite']);
    expect(errors.releveBac).toBeDefined();
    expect(errors.photoIdentite).toBeDefined();
    expect(errors.accepteConditions).toBeDefined();
  });

  it('accepte un bordereau vide (facultatif) mais invalide un bordereau interdit', () => {
    expect(documentStepErrors({ ...VALID_PERSONAL, accepteConditions: true }, {}, [])).toEqual({});
    expect(
      documentStepErrors({ ...VALID_PERSONAL, accepteConditions: true }, {}, [])
    ).not.toHaveProperty('numeroBordereau');
  });
});

describe('normalizeAdmissionPayloadData', () => {
  it('trim les champs, minuscule l’email et resserre le téléphone', () => {
    const result = normalizeAdmissionPayloadData({
      ...VALID_PERSONAL,
      nom: '  RAKOTO ',
      email: ' RINDRA@GMAIL.COM ',
      telephone: ' 032  12 345 67 ',
      numeroBordereau: ' ',
    });
    expect(result.nom).toBe('RAKOTO');
    expect(result.email).toBe('rindra@gmail.com');
    expect(result.telephone).toBe('032 12 345 67');
    expect(result.numeroBordereau).toBe('');
  });
});
