import { describe, expect, it } from 'vitest';
import { normalizePhoneForApi, sanitizeDigitsInput, sanitizePhoneInput } from './rules';
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
  validateOptionalPhone,
  validatePhone,
} from './validators';
import { validationMessages as msg } from './messages';

const CURRENT_YEAR = new Date().getFullYear();
// Valeurs réutilisées dans plusieurs jeux de tests (sonarjs/no-duplicate-string).
const INVALID_MIX = 'Rakoto123';
const INVALID_EMOJI = 'Rakoto 🎉';
// Titres de jeux de tests réutilisés (sonarjs/no-duplicate-string).
const CASE_ACCEPTS = 'accepte « %s »';
const CASE_REJECTS = 'refuse « %s »';

describe('validateName (nom)', () => {
  it.each([
    'RAKOTO',
    'RAKOTO ANDRIANINA',
    'RAZAFI-ARISON',
    "D'ANDRIANA",
    'RAZAFINDRAKOTO',
    'Jean d’Harcourt',
    'Rasoanaivo',
  ])(CASE_ACCEPTS, (value) => {
    expect(validateName(value)).toBeUndefined();
  });

  it.each([
    INVALID_MIX,
    'Rakoto@',
    '123Rakoto',
    'Rakoto#',
    'Rakoto!',
    INVALID_EMOJI,
    'RAKOTO_RAKOTA',
  ])(CASE_REJECTS, (value) => {
    expect(validateName(value)).toBeDefined();
  });

  it('est obligatoire', () => {
    expect(validateName('')).toBe(msg.nomRequired);
    expect(validateName('   ')).toBe(msg.nomRequired);
  });

  it('refuse les chiffres et symboles avec le message métier', () => {
    expect(validateName(INVALID_MIX)).toBe(msg.nomInvalid);
  });
});

describe('validateFirstName (prénom, facultatif)', () => {
  it('accepte un prénom vide', () => {
    expect(validateFirstName('')).toBeUndefined();
    expect(validateFirstName('   ')).toBeUndefined();
  });

  it('applique les mêmes règles que le nom', () => {
    expect(validateFirstName('Jean Pierre')).toBeUndefined();
    expect(validateFirstName('Rakoto')).toBeUndefined();
    expect(validateFirstName(INVALID_MIX)).toBe(msg.prenomInvalid);
    expect(validateFirstName('Rakoto!')).toBe(msg.prenomInvalid);
    expect(validateFirstName('Jean 🎉')).toBe(msg.prenomInvalid);
  });
});

describe('validatePhone (téléphone)', () => {
  it.each([
    '0321234567',
    '0331234567',
    '0341234567',
    '+261321234567',
    '+261 32 12 345 67',
    '034 12 345 67',
    '+33612345678',
    '00261321234567',
  ])(CASE_ACCEPTS, (value) => {
    expect(validatePhone(value)).toBeUndefined();
  });

  it.each([
    '03A1234567',
    '032-ABC-4567',
    'phone0321234567',
    '+261@321234567',
    '123',
    '032123456',
    '03212345678',
    '+26132123456', // trop court pour +261
    '++261321234567',
    '🎯0321234567',
  ])(CASE_REJECTS, (value) => {
    expect(validatePhone(value)).toBe(msg.phoneInvalid);
  });

  it('accepte un numéro vide lorsqu’il est facultatif (Contact)', () => {
    expect(validateOptionalPhone('')).toBeUndefined();
    expect(validateOptionalPhone('0321234567')).toBeUndefined();
    expect(validateOptionalPhone('abc')).toBe(msg.phoneInvalid);
  });

  it('nettoie la saisie (chiffres et + en tête uniquement)', () => {
    expect(sanitizePhoneInput('+261 32 12 345 67')).toBe('+261 32 12 345 67');
    expect(sanitizePhoneInput('03A1234567')).toBe('031234567');
    expect(sanitizePhoneInput('++261321234567')).toBe('+261321234567');
    expect(sanitizePhoneInput('🎯032 12')).toBe('032 12');
  });

  it('normalise avant envoi API (trim + espaces simples)', () => {
    expect(normalizePhoneForApi('  032  12 345 67 ')).toBe('032 12 345 67');
  });
});

describe('validateEmail', () => {
  it.each([
    'rindra@gmail.com',
    'jean-pierre.dupont@univ-antananarivo.mg',
    'a@b.fr',
    'user+tag@example.co.uk',
  ])(CASE_ACCEPTS, (value) => {
    expect(validateEmail(value)).toBeUndefined();
  });

  it.each([
    'test',
    'test@',
    '@gmail.com',
    'test@gmail',
    'test@@gmail.com',
    'test gmail.com',
    'test@.com',
    'test@gmail..com',
    'rindra@',
    'test@gmail.c',
  ])(CASE_REJECTS, (value) => {
    expect(validateEmail(value)).toBeDefined();
  });

  it('est obligatoire et borne la longueur', () => {
    expect(validateEmail('')).toBe(msg.emailRequired);
    expect(validateEmail('   ')).toBe(msg.emailRequired);
    expect(validateEmail(`${'a'.repeat(50)}@gmail.com`)).toBe(msg.emailTooLong);
  });
});

describe('validateBirthPlace / validateExamCenter', () => {
  it.each([
    'Antananarivo',
    'Fianarantsoa',
    'Antsirabe',
    'Toamasina',
    'Mahajanga',
    'Ambositra',
    'Sainte-Marie',
    'Ambatolampy',
    'Maroantsetra',
  ])(CASE_ACCEPTS, (value) => {
    expect(validateBirthPlace(value)).toBeUndefined();
    expect(validateExamCenter(value)).toBeUndefined();
  });

  it('accepte un centre avec ville (virgule)', () => {
    expect(validateExamCenter('Lycée Rabearivelo, Antananarivo')).toBeUndefined();
  });

  it.each(['Antananarivo123', 'Tana@', 'Tana 🎉', '123', 'Tana!'])(CASE_REJECTS, (value) => {
    expect(validateBirthPlace(value)).toBeDefined();
    expect(validateExamCenter(value)).toBeDefined();
  });

  it('lieu de naissance obligatoire', () => {
    expect(validateBirthPlace('')).toBe(msg.birthPlaceRequired);
  });
});

describe('validateAddress', () => {
  it.each([
    'Lot II A 123, Andavamamba, Antananarivo 101, Madagascar',
    '12 Rue des Lilas, 75001 Paris, France',
    'Antananarivo, Analamanga, Madagascar',
    "Lot 8 Bis d'Ambohipo (près de l'école)",
  ])(CASE_ACCEPTS, (value) => {
    expect(validateAddress(value)).toBeUndefined();
  });

  it('refuse les symboles arbitraires et le vide', () => {
    expect(validateAddress('')).toBe(msg.addressRequired);
    expect(validateAddress('Rue <script>')).toBe(msg.addressInvalid);
    expect(validateAddress('Adresse 🎉')).toBe(msg.addressInvalid);
  });
});

describe('validateNationality', () => {
  it('accepte les nationalités usuelles', () => {
    expect(validateNationality('Malgache')).toBeUndefined();
    expect(validateNationality('Française')).toBeUndefined();
  });

  it('refuse le vide et les symboles', () => {
    expect(validateNationality('')).toBe(msg.nationalityRequired);
    expect(validateNationality('Malgache123')).toBe(msg.nationalityInvalid);
  });
});

describe('validateBacNumber (numéro BAC, numérique strict)', () => {
  it.each(['123456789', '202612345678', '0001234567'])(CASE_ACCEPTS, (value) => {
    expect(validateBacNumber(value)).toBeUndefined();
  });

  it.each(['BAC123456', '123-456', '123 ABC', 'ABC123', '123', '123456789012345678901'])(
    CASE_REJECTS,
    (value) => {
      expect(validateBacNumber(value)).toBe(msg.bacNumberInvalid);
    }
  );

  it('est obligatoire', () => {
    expect(validateBacNumber('')).toBe(msg.bacNumberRequired);
    expect(validateBacNumber('  ')).toBe(msg.bacNumberRequired);
  });

  it('nettoie les espaces accidentels à la saisie', () => {
    expect(sanitizeDigitsInput('12 345 678', 20)).toBe('12345678');
    expect(sanitizeDigitsInput('BAC123', 20)).toBe('123');
    expect(sanitizeDigitsInput('2026', 4)).toBe('2026');
  });
});

describe('validateBacYear (année AAAA)', () => {
  it.each(['2026', '2025', '2024', '1980'])(CASE_ACCEPTS, (value) => {
    expect(validateBacYear(value)).toBeUndefined();
  });

  it.each(['26', '202', '20266', '20A6', 'AAAA', '1899', String(CURRENT_YEAR + 1)])(
    CASE_REJECTS,
    (value) => {
      expect(validateBacYear(value)).toBeDefined();
    }
  );

  it('est obligatoire avec le message dédié', () => {
    expect(validateBacYear('')).toBe(msg.bacYearRequired);
    expect(validateBacYear('26')).toBe(msg.bacYearInvalid);
    expect(validateBacYear(String(CURRENT_YEAR + 1))).toBe(msg.bacYearRange(1980, CURRENT_YEAR));
  });
});

describe('validateBordereau (facultatif)', () => {
  it('accepte vide', () => {
    expect(validateBordereau('')).toBeUndefined();
  });

  it.each(['BD123456', '2026BD00125', 'BORD-2026-001', 'REF20261234', 'REF 2026 12'])(
    CASE_ACCEPTS,
    (value) => {
      expect(validateBordereau(value)).toBeUndefined();
    }
  );

  it.each(['BD123456!', 'BORD@2026', 'REF#20261234', '<script>'])(CASE_REJECTS, (value) => {
    expect(validateBordereau(value)).toBe(msg.bordereauInvalid);
  });

  it('borne la longueur', () => {
    expect(validateBordereau('BORD-2026-0012345')).toBe(msg.bordereauTooLong);
  });
});

describe('validateBirthDate', () => {
  it('accepte une date passée plausible', () => {
    expect(validateBirthDate('2000-05-12')).toBeUndefined();
  });

  it('refuse vide, futur et dates impossibles', () => {
    expect(validateBirthDate('')).toBe(msg.dateNaissanceRequired);
    expect(validateBirthDate(String(CURRENT_YEAR + 1) + '-01-01')).toBe(msg.dateNaissanceInvalid);
    expect(validateBirthDate('1850-01-01')).toBe(msg.dateNaissanceTooOld);
  });
});
