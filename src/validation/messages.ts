/**
 * Messages d'erreur de validation — français, simples et humains.
 * Source unique partagée par les formulaires Contact et Admission.
 */
export const validationMessages = {
  required: 'Ce champ est obligatoire.',
  nomRequired: 'Le nom est obligatoire.',
  nomInvalid: 'Le nom ne peut contenir que des lettres, espaces, apostrophes ou traits d’union.',
  nomTooLong: 'Le nom ne peut pas dépasser 100 caractères.',
  prenomInvalid:
    'Le prénom ne peut contenir que des lettres, espaces, apostrophes ou traits d’union.',
  prenomTooLong: 'Le prénom ne peut pas dépasser 100 caractères.',
  emailRequired: 'Veuillez saisir une adresse email valide.',
  emailInvalid: 'Veuillez saisir une adresse email valide.',
  emailTooLong: 'L’adresse email ne peut pas dépasser 50 caractères.',
  emailUnverified: 'Cette adresse email semble invalide ou ne peut pas être vérifiée.',
  phoneInvalid: 'Veuillez saisir un numéro de téléphone valide.',
  birthPlaceRequired: 'Le lieu de naissance est obligatoire.',
  birthPlaceInvalid: 'Veuillez saisir un lieu de naissance valide.',
  examCenterInvalid: 'Veuillez saisir un centre d’examen valide.',
  addressRequired: 'L’adresse est obligatoire.',
  addressInvalid: 'L’adresse contient des caractères non autorisés.',
  addressTooLong: 'L’adresse ne peut pas dépasser 255 caractères.',
  nationalityRequired: 'La nationalité est obligatoire.',
  nationalityInvalid:
    'La nationalité ne peut contenir que des lettres, espaces, apostrophes ou traits d’union.',
  bacNumberRequired: 'Le numéro d’inscription au baccalauréat est obligatoire.',
  bacNumberInvalid: 'Le numéro du baccalauréat doit contenir uniquement des chiffres.',
  bacNumberTooLong: 'Le numéro du baccalauréat ne peut pas dépasser 20 chiffres.',
  bacYearRequired: 'L’année d’obtention est obligatoire.',
  bacYearInvalid: 'L’année doit être composée de 4 chiffres.',
  bacYearRange: (minYear: number, maxYear: number): string =>
    `L’année doit être comprise entre ${minYear} et ${maxYear}.`,
  bordereauInvalid: 'Le numéro de bordereau contient des caractères non autorisés.',
  bordereauTooLong: 'Le numéro de bordereau ne peut pas dépasser 15 caractères.',
  dateNaissanceRequired: 'La date de naissance est obligatoire.',
  dateNaissanceInvalid: 'La date de naissance doit être antérieure à aujourd’hui.',
  dateNaissanceTooOld: 'La date de naissance semble incorrecte.',
  sujetRequired: 'Veuillez choisir un sujet.',
  messageRequired: 'Le message est obligatoire.',
  messageTooLong: 'Le message ne peut pas dépasser 1000 caractères.',
  apiGeneric: 'Une erreur est survenue lors de l’envoi du formulaire. Veuillez réessayer.',
} as const;
