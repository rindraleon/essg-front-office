import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
  Info,
  LoaderCircle,
  Paperclip,
  RefreshCcw,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react';
import {
  BAC_CATEGORIES,
  getBacCategory,
  getBacSeries,
  getEligiblePrograms,
  getRequiredDocumentIds,
} from '@/config';
import type { AdmissionDocumentKind, AdmissionFormData, AdmissionFormProps } from '@/types';
import { cn } from '@/lib';
import {
  bacStepErrors,
  documentStepErrors,
  formationStepErrors,
  mapApiErrorToFormErrors,
  normalizeAdmissionPayloadData,
  personalStepErrors,
  sanitizeDigitsInput,
  sanitizePhoneInput,
  validateEmail,
  validationMessages,
  type AdmissionField,
  type AdmissionFiles,
  type FormErrors,
} from '@/validation';
import { verifyEmailDomain } from '@/services/contact.service';
import { toCapitalizedWords, toUpperName } from '@/utils';
import { admissionService, formatFileSize, isProofFileValid } from '@/services';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { FormFieldError } from '../ui/field-error';
import { fieldA11yProps } from '@/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  AdmissionSectionTitle,
  BacInformation,
  FormationSelection,
  LevelSelection,
  PersonalInformation,
  PreviousEducationInformation,
} from './AdmissionFormSections';

const CURRENT_YEAR = new Date().getFullYear();

const INITIAL_FORM_DATA: AdmissionFormData = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  lieuNaissance: '',
  nationalite: 'Malgache',
  sexe: '',
  adresse: '',
  telephone: '',
  email: '',
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

type AdmissionStep = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: 'Informations personnelles', shortLabel: 'Identité', icon: UserRound },
  { id: 2, label: 'Informations sur le Bac', shortLabel: 'Bac', icon: GraduationCap },
  { id: 3, label: 'Formation souhaitée', shortLabel: 'Formation', icon: BookOpenCheck },
  { id: 4, label: 'Pièces jointes', shortLabel: 'Documents', icon: Paperclip },
] as const;

/** Champs purement numériques (chiffres uniquement, longueur bornée). */
const DIGITS_ONLY_FIELDS: Partial<Record<AdmissionField, number>> = {
  numeroBaccalaureat: 20,
  bacAnneeObtention: 4,
  licenceAnneeObtention: 4,
};

const TITLE_CASE_FIELDS = new Set<AdmissionField>([
  'prenom',
  'lieuNaissance',
  'nationalite',
  'adresse',
  'bacCentreExamen',
  'ancienEtablissement',
  'licenceEtablissement',
  'licenceMention',
]);

const UPPER_CASE_FIELDS = new Set<AdmissionField>(['nom', 'numeroMatricule']);

/** Champs textuels connus — utilisés pour rattacher les erreurs API au bon champ. */
const ADMISSION_FIELD_NAMES = Object.keys(INITIAL_FORM_DATA).filter(
  (key) => key !== 'accepteConditions'
);

function formatFieldValue(name: AdmissionField, value: string): string {
  const digitsMaxLength = DIGITS_ONLY_FIELDS[name];
  if (digitsMaxLength !== undefined) return sanitizeDigitsInput(value, digitsMaxLength);
  if (name === 'telephone') return sanitizePhoneInput(value);
  if (UPPER_CASE_FIELDS.has(name)) return toUpperName(value);
  if (TITLE_CASE_FIELDS.has(name)) return toCapitalizedWords(value);
  return value;
}

const HINT_PDF_IMG = 'PDF, JPG ou PNG — 10 Mo max';
const HINT_IMG = 'JPG ou PNG — 10 Mo max';
const ACCEPT_PDF_IMG = '.pdf,.jpg,.jpeg,.png';
const ACCEPT_IMG = '.jpg,.jpeg,.png';

const FILE_CONFIG: Record<AdmissionDocumentKind, { label: string; hint: string; accept: string }> =
  {
    demandeInscription: {
      label: "Demande d'inscription",
      hint: HINT_PDF_IMG,
      accept: ACCEPT_PDF_IMG,
    },
    bordereau: {
      label: "Reçu de versement des droits d'inscription (60 000 Ar)",
      hint: HINT_PDF_IMG,
      accept: ACCEPT_PDF_IMG,
    },
    photoIdentite: {
      label: "Photo d'identité récente",
      hint: HINT_IMG,
      accept: ACCEPT_IMG,
    },
    acteEtatCivil: {
      label: "Acte d'état civil",
      hint: HINT_PDF_IMG,
      accept: ACCEPT_PDF_IMG,
    },
    releveBac: {
      label: 'Relevé de notes du baccalauréat ou extrait de liste',
      hint: HINT_PDF_IMG,
      accept: ACCEPT_PDF_IMG,
    },
    diplomeBac: {
      label: 'Photocopie du diplôme du baccalauréat',
      hint: HINT_PDF_IMG,
      accept: ACCEPT_PDF_IMG,
    },
    attestationEtablissement: {
      label: "Attestation provenant de l'ancien établissement",
      hint: HINT_PDF_IMG,
      accept: ACCEPT_PDF_IMG,
    },
  };

function FilePicker({
  kind,
  file,
  required,
  error,
  onChange,
}: Readonly<{
  kind: AdmissionDocumentKind;
  file: File | null;
  required?: boolean;
  error?: string;
  onChange: (file: File | null) => void;
}>) {
  const config = FILE_CONFIG[kind];
  const handleChange = (next: File | null) => {
    if (!next) return;
    const validation = isProofFileValid(next);
    if (!validation.ok) {
      toast.error(validation.error ?? 'Fichier invalide');
      return;
    }
    onChange(next);
  };

  return (
    <div className="space-y-1.5" data-field={kind} tabIndex={-1}>
      <Label htmlFor={`file-${kind}`} className="mb-2 block">
        {config.label} {required ? '*' : ''}
      </Label>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 px-3 py-2.5">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-brand-600 shadow-sm">
            <FileText className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-small font-medium text-ink-900">{file.name}</p>
            <p className="text-caption text-ink-500">{formatFileSize(file.size)}</p>
          </div>
          <label
            htmlFor={`file-${kind}`}
            className="cursor-pointer rounded-lg border border-ink-200 bg-white p-2 text-ink-600 hover:text-brand-700"
            aria-label={`Remplacer ${config.label}`}
          >
            <RefreshCcw className="size-3.5" />
          </label>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-lg border border-danger-100 bg-white p-2 text-danger-600 hover:bg-danger-50"
            aria-label={`Supprimer ${config.label}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={`file-${kind}`}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 bg-white px-4 py-3.5 text-small text-ink-500 hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700"
        >
          <Upload className="size-4" />
          Choisir un fichier
        </label>
      )}
      <input
        id={`file-${kind}`}
        type="file"
        accept={config.accept}
        className="sr-only"
        onChange={(event) => {
          handleChange(event.target.files?.[0] ?? null);
          event.target.value = '';
        }}
      />
      <p className="text-caption text-ink-400">{config.hint}</p>
      <FormFieldError id={`file-${kind}-error`} error={error} />
    </div>
  );
}

const AdmissionForm = ({ onSubmit }: AdmissionFormProps) => {
  const [formData, setFormData] = useState<AdmissionFormData>(INITIAL_FORM_DATA);
  const [files, setFiles] = useState<AdmissionFiles>({});
  /** Erreurs asynchrones : doublons, vérification email serveur, rejets API. */
  const [asyncErrors, setAsyncErrors] = useState<FormErrors>({});
  /** Champs touchés (perte de focus) : l'erreur de format n'apparaît qu'après interaction. */
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  /** Tentative de validation de l'étape courante : affiche toutes ses erreurs. */
  const [stepAttempted, setStepAttempted] = useState(false);
  const [currentStep, setCurrentStep] = useState<AdmissionStep>(1);
  const formTopRef = useRef<HTMLDivElement>(null);
  const finalSubmitRequestedRef = useRef(false);
  const lastVerifiedEmailRef = useRef('');
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const bacSeries = useMemo(() => getBacSeries(formData.bacType), [formData.bacType]);
  const eligiblePrograms = useMemo(
    () => getEligiblePrograms(formData.niveau, formData.bacCategorie),
    [formData.niveau, formData.bacCategorie]
  );
  const eligibleMentions = useMemo(
    () => [...new Map(eligiblePrograms.map((program) => [program.mentionId, program])).values()],
    [eligiblePrograms]
  );
  const eligibleParcours = useMemo(
    () => eligiblePrograms.filter((program) => program.mentionId === formData.mention),
    [eligiblePrograms, formData.mention]
  );
  const requiredDocumentIds = useMemo(
    () =>
      getRequiredDocumentIds(
        formData.niveau,
        formData.bacAnneeObtention,
        CURRENT_YEAR
      ) as AdmissionDocumentKind[],
    [formData.niveau, formData.bacAnneeObtention]
  );
  const missingDocumentCount = requiredDocumentIds.filter((kind) => !files[kind]).length;

  /** Erreurs de format de l'étape courante (validateurs partagés). */
  const stepFormatErrors = useMemo<FormErrors>(() => {
    if (currentStep === 1) return personalStepErrors(formData);
    if (currentStep === 2) return bacStepErrors(formData);
    if (currentStep === 3) return formationStepErrors(formData, eligiblePrograms);
    return documentStepErrors(formData, files, requiredDocumentIds);
  }, [currentStep, formData, eligiblePrograms, files, requiredDocumentIds]);

  /**
   * Erreurs visibles de l'étape courante : erreurs asynchrones immédiates, et
   * erreurs de format seulement après blur du champ ou tentative de validation.
   */
  const visibleErrors = useMemo<FormErrors>(() => {
    const merged: FormErrors = {};
    const keys = new Set<string>([...Object.keys(stepFormatErrors), ...Object.keys(asyncErrors)]);
    keys.forEach((key) => {
      const error =
        asyncErrors[key] ??
        (touchedFields[key] || stepAttempted ? stepFormatErrors[key] : undefined);
      if (error) merged[key] = error;
    });
    return merged;
  }, [stepFormatErrors, asyncErrors, touchedFields, stepAttempted]);

  const setField = (name: AdmissionField, value: string) => {
    setFormData((previous) => {
      const next = { ...previous, [name]: value };
      if (name === 'bacType') {
        next.bacSerie = '';
        next.bacCategorie = '';
        next.mention = '';
        next.parcours = '';
        next.formation = '';
      }
      if (name === 'bacSerie') {
        next.bacCategorie = getBacCategory(next.bacType, value);
        next.mention = '';
        next.parcours = '';
        next.formation = '';
      }
      if (name === 'niveau') {
        next.mention = '';
        next.parcours = '';
        next.formation = '';
      }
      if (name === 'mention') {
        next.parcours = '';
        next.formation = '';
      }
      if (name === 'parcours') {
        next.formation =
          eligiblePrograms.find((program) => program.parcoursId === value)?.parcoursLabel ?? '';
      }
      if (name === 'ancienEtablissement') next.licenceEtablissement = value;
      return next;
    });
    setAsyncErrors((previous) => ({ ...previous, [name]: undefined, eligibility: undefined }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const fieldName = name as AdmissionField;
    setField(fieldName, formatFieldValue(fieldName, value));
  };

  /** Blur délégué au <form> : marque le champ comme touché (validation douce). */
  const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as EventTarget & { name?: string };
    if (!target.name) return;
    setTouchedFields((previous) => ({ ...previous, [target.name as string]: true }));
  };

  const setFile = (kind: AdmissionDocumentKind, file: File | null) => {
    setFiles((previous) => {
      const next = { ...previous };
      if (file) next[kind] = file;
      else delete next[kind];
      return next;
    });
    setAsyncErrors((previous) => ({ ...previous, [kind]: undefined }));
  };

  /** Vérifie côté serveur que le domaine email peut recevoir des messages (fail-open). */
  const verifyEmail = async (email: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || validateEmail(trimmed)) return false;
    if (lastVerifiedEmailRef.current === trimmed) return !asyncErrors.email;
    lastVerifiedEmailRef.current = trimmed;
    const result = await verifyEmailDomain(trimmed);
    if (result?.valide === false) {
      setAsyncErrors((previous) => ({
        ...previous,
        email: result.raison || validationMessages.emailUnverified,
      }));
      return false;
    }
    return true;
  };

  const checkDuplicate = async (
    kind: 'numeroBordereau' | 'email' | 'telephone'
  ): Promise<boolean> => {
    const value = formData[kind].trim();
    if (!value) return true;
    try {
      const result = await admissionService.checkDuplicate({ [kind]: value });
      const disponibilites = {
        numeroBordereau: result.numeroBordereauDisponible,
        email: result.emailDisponible,
        telephone: result.telephoneDisponible,
      } as const;
      const disponible = disponibilites[kind];
      if (disponible === false) {
        const annee = result.annee ? ` pour l'année ${result.annee}` : '';
        const messages = {
          numeroBordereau: 'Ce numéro de bordereau est déjà utilisé.',
          email: `Une candidature avec cette adresse email a déjà été déposée${annee}. Une seule inscription est autorisée par an.`,
          telephone: `Une candidature avec ce numéro de téléphone a déjà été déposée${annee}. Une seule inscription est autorisée par an.`,
        } as const;
        setAsyncErrors((previous) => ({
          ...previous,
          [kind]: messages[kind],
        }));
        return false;
      }
      return true;
    } catch {
      return true;
    }
  };

  /** Blur du champ email : vérification du domaine puis des doublons annuels. */
  const handleEmailBlur = (email: string): Promise<boolean> =>
    verifyEmail(email).then((domainOk) => (domainOk ? checkDuplicate('email') : false));

  const focusFirstError = (nextErrors: FormErrors) => {
    const firstField = Object.keys(nextErrors)[0];
    if (!firstField) return;
    window.requestAnimationFrame(() => {
      const field = formTopRef.current?.querySelector<HTMLElement>(
        `[name="${firstField}"], [data-field="${firstField}"]`
      );
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      field?.focus({ preventScroll: true });
    });
  };

  const getStepErrors = (step: AdmissionStep): FormErrors => {
    if (step === 1) return personalStepErrors(formData);
    if (step === 2) return bacStepErrors(formData);
    if (step === 3) return formationStepErrors(formData, eligiblePrograms);
    return documentStepErrors(formData, files, requiredDocumentIds);
  };

  const validateStep = (step: AdmissionStep): boolean => {
    setStepAttempted(true);
    const nextErrors = getStepErrors(step);
    const hasAsyncError = Object.keys(asyncErrors).some((key) => asyncErrors[key]);
    const valid = Object.keys(nextErrors).length === 0 && !hasAsyncError;
    if (!valid) focusFirstError({ ...asyncErrors, ...nextErrors });
    return valid;
  };

  const moveToStep = (step: AdmissionStep) => {
    finalSubmitRequestedRef.current = false;
    setCurrentStep(step);
    setStepAttempted(false);
    setAsyncErrors({});
    window.requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Veuillez compléter les champs signalés.');
      return;
    }
    if (currentStep === 1) {
      if (!(await handleEmailBlur(formData.email))) return;
      if (!(await checkDuplicate('telephone'))) return;
    }
    if (currentStep < 4) moveToStep((currentStep + 1) as AdmissionStep);
  };

  const validateAll = (): boolean => {
    const allErrors = {
      ...personalStepErrors(formData),
      ...bacStepErrors(formData),
      ...formationStepErrors(formData, eligiblePrograms),
      ...documentStepErrors(formData, files, requiredDocumentIds),
    };
    setStepAttempted(true);
    const valid = Object.keys(allErrors).length === 0;
    if (!valid) focusFirstError(allErrors);
    return valid;
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentStep < 4) {
      await handleNext();
      return;
    }
    if (!finalSubmitRequestedRef.current) return;
    finalSubmitRequestedRef.current = false;
    if (submitting || !validateAll()) {
      if (!submitting) toast.error('Veuillez joindre les pièces obligatoires signalées.');
      return;
    }
    if (formData.numeroBordereau.trim() && !(await checkDuplicate('numeroBordereau'))) {
      toast.error('Le numéro de bordereau saisi est déjà utilisé.');
      return;
    }
    const categoryLabel =
      BAC_CATEGORIES[formData.bacCategorie as keyof typeof BAC_CATEGORIES]?.label ??
      formData.bacCategorie;
    const normalizedData = normalizeAdmissionPayloadData(formData);
    const payloadData = {
      ...normalizedData,
      diplomePrecedent:
        normalizedData.niveau === 'master' ? 'Licence' : `Baccalauréat ${categoryLabel}`,
      licenceEtablissement: normalizedData.ancienEtablissement,
    };
    const payload = new FormData();
    Object.entries(payloadData).forEach(([key, value]) => {
      if (key !== 'accepteConditions' && typeof value === 'string' && value.trim())
        payload.append(key, value);
    });
    Object.entries(files).forEach(([kind, file]) => {
      if (file) payload.append(kind, file);
    });
    setSubmitting(true);
    setProgress(0);
    try {
      await admissionService.createAdmission(payload, setProgress);
      onSubmit?.(payloadData);
      toast.success('Candidature soumise avec succès ! Vous recevrez un email de confirmation.');
      setSubmitted(true);
    } catch (error) {
      // Rattachement au champ concerné quand l'erreur backend l'identifie,
      // notification globale claire sinon (jamais de détail technique).
      const { fieldErrors: mapped, globalMessage } = mapApiErrorToFormErrors(
        error,
        ADMISSION_FIELD_NAMES
      );
      if (Object.keys(mapped).length > 0) {
        setAsyncErrors((previous) => ({ ...previous, ...mapped }));
      }
      toast.error(globalMessage ?? 'Une erreur est survenue lors de la soumission.', {
        duration: 6000,
      });
      setProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-10">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-brand-100 text-brand-700">
            <CheckCircle2 className="size-9" />
          </div>
          <h2 className="text-h3 text-ink-900">Candidature envoyée !</h2>
          <p className="max-w-md text-small text-ink-500">
            Votre dossier a bien été enregistré. Un accusé de réception vous a été envoyé par email.
          </p>
          <Button type="button" variant="outline" onClick={() => window.scrollTo({ top: 0 })}>
            Retour en haut
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={formTopRef}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8"
    >
      <h2 className="mb-2 text-h3 text-ink-900">Formulaire de candidature</h2>
      <p className="mb-8 text-small text-ink-500">
        Les champs marqués d'un astérisque (*) sont obligatoires. Les formations proposées
        s'adaptent automatiquement à votre baccalauréat.
      </p>
      <form onSubmit={handleSubmit} onBlur={handleBlur} className="space-y-8" noValidate>
        <nav aria-label="Progression de la candidature" className="relative mb-10">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 bg-ink-100"
            aria-hidden="true"
          >
            <div
              className="h-full origin-left bg-brand-600 transition-transform duration-(--duration-hover)"
              style={{ transform: `scaleX(${(currentStep - 1) / 3})` }}
            />
          </div>
          <ol className="relative grid grid-cols-4 gap-2">
            {STEPS.map(({ id, label, shortLabel, icon: Icon }) => {
              const completed = id < currentStep;
              const active = id === currentStep;
              const accessible = id <= currentStep;
              let stepStatus = '';
              if (completed) stepStatus = ' — terminée';
              if (active) stepStatus = ' — étape actuelle';
              return (
                <li key={id} className="flex min-w-0 flex-col items-center text-center">
                  <button
                    type="button"
                    disabled={!accessible || active}
                    onClick={() => moveToStep(id)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`${label}${stepStatus}`}
                    className={cn(
                      'relative z-10 grid size-10 place-items-center rounded-full border-2 transition-[background-color,border-color,color,transform] duration-(--duration-hover)',
                      completed && 'border-brand-600 bg-brand-600 text-white hover:scale-105',
                      active &&
                        'border-brand-600 bg-white text-brand-700 shadow-[0_0_0_5px_rgb(84_124_54_/_.12)]',
                      !completed && !active && 'border-ink-200 bg-white text-ink-400'
                    )}
                  >
                    {completed ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </button>
                  <span
                    className={cn(
                      'mt-3 truncate text-caption font-semibold',
                      active || completed ? 'text-brand-700' : 'text-ink-400',
                      completed && 'invisible'
                    )}
                  >
                    <span className="sm:hidden">{shortLabel}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3 text-caption text-ink-500">
            <span>Étape {currentStep} sur 4</span>
            <strong className="text-brand-700">{STEPS[currentStep - 1].label}</strong>
          </div>
          <div aria-live="polite" className="sr-only">
            Étape {currentStep} sur 4 : {STEPS[currentStep - 1].label}
          </div>
        </nav>

        <div key={currentStep} className="animate-fade-in-up">
          {currentStep === 1 && (
            <PersonalInformation
              data={formData}
              errors={visibleErrors}
              onChange={handleChange}
              onDuplicateCheck={(field) =>
                field === 'email'
                  ? void handleEmailBlur(formData.email)
                  : void checkDuplicate(field)
              }
            />
          )}

          {currentStep === 2 && (
            <BacInformation
              data={formData}
              series={bacSeries}
              errors={visibleErrors}
              onChange={handleChange}
            />
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <LevelSelection data={formData} errors={visibleErrors} onChange={handleChange} />
              <PreviousEducationInformation
                data={formData}
                errors={visibleErrors}
                onChange={handleChange}
              />
              <FormationSelection
                data={formData}
                mentions={eligibleMentions}
                parcours={eligibleParcours}
                errors={visibleErrors}
                onChange={handleChange}
              />
              {visibleErrors.eligibility && (
                <p className="rounded-xl border border-danger-100 bg-danger-50 p-3 text-small text-danger-700">
                  {visibleErrors.eligibility}
                </p>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <section>
                <AdmissionSectionTitle number={4}>Pièces jointes & Paiement</AdmissionSectionTitle>
                <div className="mb-6 grid gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-4 sm:grid-cols-3">
                  <div>
                    <span className="text-caption text-ink-500">Candidat</span>
                    <strong className="mt-1 block text-small text-ink-900">
                      {formData.nom} {formData.prenom}
                    </strong>
                  </div>
                  <div>
                    <span className="text-caption text-ink-500">Baccalauréat</span>
                    <strong className="mt-1 block text-small text-ink-900">
                      {BAC_CATEGORIES[formData.bacCategorie as keyof typeof BAC_CATEGORIES]?.label}{' '}
                      · {formData.bacSerie.toUpperCase()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-caption text-ink-500">Formation</span>
                    <strong className="mt-1 block text-small text-ink-900">
                      {formData.formation || 'À compléter'}
                    </strong>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-brand-100 bg-white p-4 shadow-sm space-y-2">
                  <Label htmlFor="numeroBordereau">Numéro de bordereau de versement</Label>
                  <Input
                    id="numeroBordereau"
                    name="numeroBordereau"
                    value={formData.numeroBordereau}
                    onChange={handleChange}
                    onBlur={() => void checkDuplicate('numeroBordereau')}
                    placeholder="Ex : VER-2026-987456"
                    maxLength={15}
                    {...fieldA11yProps('numeroBordereau', visibleErrors.numeroBordereau)}
                  />
                  <FormFieldError
                    id="numeroBordereau-error"
                    error={visibleErrors.numeroBordereau}
                  />
                  <p className="text-caption text-ink-400">
                    Référence du reçu de paiement des droits d'inscription (60 000 Ar).
                  </p>
                </div>

                <div className="mb-5 flex items-start gap-2 rounded-xl border border-brand-100 bg-brand-50 p-3 text-small text-brand-800">
                  <Info className="mt-0.5 size-4 shrink-0" />
                  {formData.bacAnneeObtention && Number(formData.bacAnneeObtention) === CURRENT_YEAR
                    ? "Pour un Bac obtenu cette année, le relevé de notes ou l'extrait de liste est demandé."
                    : 'Pour un Bac obtenu avant cette année, la photocopie du diplôme est demandée.'}
                </div>
                {stepAttempted && missingDocumentCount > 0 && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-small text-danger-700"
                  >
                    Il reste {missingDocumentCount} pièce{missingDocumentCount > 1 ? 's' : ''}{' '}
                    obligatoire{missingDocumentCount > 1 ? 's' : ''} à joindre.
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  {requiredDocumentIds.map((kind) => (
                    <FilePicker
                      key={kind}
                      kind={kind}
                      file={files[kind] ?? null}
                      required
                      error={visibleErrors[kind]}
                      onChange={(file) => setFile(kind, file)}
                    />
                  ))}
                </div>
              </section>

              <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
                <Checkbox
                  checked={formData.accepteConditions}
                  onChange={(event) => {
                    setFormData((previous) => ({
                      ...previous,
                      accepteConditions: event.target.checked,
                    }));
                    setAsyncErrors((previous) => ({ ...previous, accepteConditions: undefined }));
                  }}
                  label="J'accepte les conditions générales *"
                  {...fieldA11yProps('accepteConditions', visibleErrors.accepteConditions)}
                />
                <p className="mt-2 pl-6 text-small text-ink-500">
                  Je certifie que les informations fournies sont exactes et comprends que toute
                  fausse déclaration peut entraîner le rejet de ma candidature.
                </p>
                <FormFieldError
                  id="accepteConditions-error"
                  error={visibleErrors.accepteConditions}
                />
              </div>

              {submitting && (
                <div className="space-y-2" aria-live="polite">
                  <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full origin-left rounded-full bg-brand-600 transition-transform duration-(--duration-hover)"
                      style={{ transform: `scaleX(${Math.max(progress, 8) / 100})` }}
                    />
                  </div>
                  <p className="text-center text-caption text-ink-500">
                    Envoi de la candidature... {progress > 0 ? `${progress}%` : ''}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:justify-between">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => moveToStep((currentStep - 1) as AdmissionStep)}
              disabled={submitting}
            >
              <ArrowLeft className="size-4" />
              Étape précédente
            </Button>
          ) : (
            <span />
          )}

          {currentStep < 4 ? (
            <Button type="button" onClick={() => void handleNext()}>
              Continuer
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={submitting}
              onClick={() => {
                finalSubmitRequestedRef.current = true;
              }}
            >
              {submitting ? 'Soumission en cours...' : 'Soumettre ma candidature'}
              {submitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;
