export type AdmissionFormData = {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  sexe: string;
  adresse: string;
  telephone: string;
  email: string;
  bacType: string;
  bacSerie: string;
  bacCategorie: string;
  numeroBaccalaureat: string;
  bacAnneeObtention: string;
  bacCentreExamen: string;
  niveau: string;
  mention: string;
  parcours: string;
  formation: string;
  diplomePrecedent: string;
  ancienEtablissement: string;
  numeroMatricule: string;
  licenceEtablissement: string;
  licenceMention: string;
  licenceAnneeObtention: string;
  numeroBordereau: string;
  releveBac?: File;
  bordereau?: File;
  demandeInscription?: File;
  photoIdentite?: File;
  acteEtatCivil?: File;
  diplomeBac?: File;
  attestationEtablissement?: File;
  accepteConditions: boolean;
};

export type AdmissionDocumentKind =
  | 'releveBac'
  | 'bordereau'
  | 'demandeInscription'
  | 'photoIdentite'
  | 'acteEtatCivil'
  | 'diplomeBac'
  | 'attestationEtablissement';

export type AdmissionDuplicateCheck = {
  numeroBaccalaureatDisponible?: boolean;
  numeroBordereauDisponible?: boolean;
  emailDisponible?: boolean;
  telephoneDisponible?: boolean;
  annee?: number;
};

export type AdmissionFormProps = {
  niveaux?: { value: string; label: string }[];
  formations?: { value: string; label: string }[];
  onSubmit?: (data: AdmissionFormData) => void;
};

export type AdmissionPageProps = {
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
};

export type AdmissionCtaSectionProps = {
  title?: string;
  description?: string;
  primaryButtonLabel?: string;
  primaryButtonLink?: string;
  secondaryButtonLabel?: string;
  secondaryButtonLink?: string;
};
