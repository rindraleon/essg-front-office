import type { ReactNode } from 'react';

export type AdmissionStep = {
  date: string;
  titre: string;
  icon: ReactNode;
};

export type AdmissionTimelineProps = {
  title?: string;
  steps?: AdmissionStep[];
};

export type AdmissionFormData = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  niveau: string;
  formation: string;
  diplomePrecedent: string;
  adresse: string;
  numeroBaccalaureat: string;
  licenceEtablissement: string;
  licenceMention: string;
  licenceAnneeObtention: string;
  numeroBordereau: string;
  cv?: File;
  lettreMotivation?: File;
  releveBac?: File;
  attestationBac?: File;
  releveL3?: File;
  bordereau?: File;
  accepteConditions: boolean;
};

export type AdmissionDocumentKind =
  'cv' | 'lettreMotivation' | 'releveBac' | 'attestationBac' | 'releveL3' | 'bordereau';

export type AdmissionDuplicateCheck = {
  numeroBaccalaureatDisponible?: boolean;
  numeroBordereauDisponible?: boolean;
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
