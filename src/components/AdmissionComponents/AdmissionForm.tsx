import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Info,
  LoaderCircle,
  RefreshCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import { toUpperName } from '../../utils/slug.utils';
import type { AdmissionDocumentKind, AdmissionFormData, AdmissionFormProps } from '../../types';
import { ApiError } from '@/api/types/api';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import {
  admissionService,
  formatFileSize,
  isProofFileValid,
} from '../../services/admission.service';

const INITIAL_FORM_DATA: AdmissionFormData = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  dateNaissance: '',
  niveau: '',
  formation: '',
  diplomePrecedent: '',
  adresse: '',
  numeroBaccalaureat: '',
  licenceEtablissement: '',
  licenceMention: '',
  licenceAnneeObtention: '',
  numeroBordereau: '',
  accepteConditions: false,
};

const DEFAULT_NIVEAUX = [
  { value: 'licence', label: 'Licence' },
  { value: 'master', label: 'Master' },
  { value: 'doctorat', label: 'Doctorat' },
];

const DEFAULT_FORMATIONS = [
  { value: 'geomatique-applications', label: 'Géomatique et Applications' },
  { value: 'geomatique-management', label: 'Géomatique et Management' },
  { value: 'informatique-donnees', label: 'Informatique et Données Spatiales' },
];

const FILE_HINTS: Record<AdmissionDocumentKind, string> = {
  cv: 'PDF — 10 Mo max',
  lettreMotivation: 'PDF — 10 Mo max',
  releveBac: 'PDF, JPG ou PNG — 10 Mo max',
  attestationBac: 'PDF, JPG ou PNG — 10 Mo max',
  releveL3: 'PDF, JPG ou PNG — 10 Mo max',
  bordereau: 'PDF, JPG ou PNG — 10 Mo max',
};

const FILE_ACCEPT: Record<AdmissionDocumentKind, string> = {
  cv: '.pdf',
  lettreMotivation: '.pdf',
  releveBac: '.pdf,.jpg,.jpeg,.png',
  attestationBac: '.pdf,.jpg,.jpeg,.png',
  releveL3: '.pdf,.jpg,.jpeg,.png',
  bordereau: '.pdf,.jpg,.jpeg,.png',
};

const FILE_LABELS: Record<AdmissionDocumentKind, string> = {
  cv: 'CV',
  lettreMotivation: 'Lettre de motivation',
  releveBac: 'Relevé de notes du baccalauréat',
  attestationBac: 'Attestation de réussite au baccalauréat',
  releveL3: 'Relevé de notes L3',
  bordereau: 'Justificatif du bordereau de versement',
};

interface FilePickerProps {
  kind: AdmissionDocumentKind;
  file: File | null;
  required?: boolean;
  error?: string;
  onChange: (file: File | null) => void;
}

const FilePicker = ({ kind, file, required, error, onChange }: FilePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="space-y-1.5">
      <Label htmlFor={`file-${kind}`} className="mb-2 block">
        {FILE_LABELS[kind]} {required ? '*' : ''}
      </Label>

      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
            <FileText className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-small font-medium text-ink-900">{file.name}</p>
            <p className="text-caption text-ink-500">
              {formatFileSize(file.size)} · {file.type || 'type inconnu'}
            </p>
          </div>
          <label
            htmlFor={`file-${kind}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-caption font-medium text-ink-600 transition-colors hover:border-brand-600 hover:text-brand-700"
          >
            <RefreshCcw className="size-3.5" />
            Remplacer
          </label>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-caption font-medium text-red-600 transition-colors hover:bg-red-50"
            aria-label={`Supprimer ${FILE_LABELS[kind]}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={`file-${kind}`}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 bg-white px-4 py-3.5 text-small text-ink-500 transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700"
        >
          <Upload className="size-4" />
          Choisir un fichier
        </label>
      )}

      <input
        id={`file-${kind}`}
        ref={inputRef}
        type="file"
        accept={FILE_ACCEPT[kind]}
        className="sr-only"
        onChange={(e) => {
          handleChange(e.target.files?.[0] ?? null);
          e.target.value = '';
        }}
      />

      <p className="text-caption text-ink-400">Formats acceptés : {FILE_HINTS[kind]}</p>
      {error && <p className="text-caption text-red-600">{error}</p>}
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-4 text-h5 font-semibold text-ink-900">{children}</h3>
);

const fieldError = (errors: Record<string, string | undefined>, key: string) =>
  errors[key] ? <p className="mt-1 text-caption text-red-600">{errors[key]}</p> : null;

const AdmissionForm = ({
  niveaux = DEFAULT_NIVEAUX,
  formations = DEFAULT_FORMATIONS,
  onSubmit,
}: AdmissionFormProps) => {
  const [formData, setFormData] = useState<AdmissionFormData>(INITIAL_FORM_DATA);
  const [files, setFiles] = useState<Partial<Record<AdmissionDocumentKind, File>>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const loading = submitting;
  const niveau = formData.niveau;
  const isLicence = niveau === 'licence';
  const isMaster = niveau === 'master';

  const setField = (name: keyof AdmissionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setField(name as keyof AdmissionFormData, name === 'nom' ? toUpperName(value) : value);
  };

  const setFile = (kind: AdmissionDocumentKind, file: File | null) => {
    setFiles((prev) => {
      const next = { ...prev };
      if (file) next[kind] = file;
      else delete next[kind];
      return next;
    });
    setErrors((prev) => ({ ...prev, [kind]: undefined }));
  };

  const checkDuplicate = async (kind: 'numeroBaccalaureat' | 'numeroBordereau') => {
    const value = formData[kind].trim();
    if (!value) return;
    try {
      const result = await admissionService.checkDuplicate(
        kind === 'numeroBaccalaureat' ? { numeroBaccalaureat: value } : { numeroBordereau: value }
      );
      const available =
        kind === 'numeroBaccalaureat'
          ? result.numeroBaccalaureatDisponible
          : result.numeroBordereauDisponible;
      if (available === false) {
        const message =
          kind === 'numeroBaccalaureat'
            ? 'Ce numéro d’inscription au baccalauréat est déjà utilisé.'
            : 'Ce numéro de bordereau de versement est déjà utilisé.';
        setErrors((prev) => ({ ...prev, [kind]: message }));
      }
    } catch {
      // La vérification est une amélioration UX : le backend reste la source
      // de vérité et refusera la candidature si le numéro est pris.
    }
  };

  const validateRequiredFields = (next: Record<string, string | undefined>) => {
    const required: Array<keyof AdmissionFormData> = [
      'nom',
      'prenom',
      'email',
      'telephone',
      'dateNaissance',
      'niveau',
      'formation',
      'diplomePrecedent',
      'numeroBordereau',
    ];
    required.forEach((key) => {
      const value = formData[key];
      if (typeof value === 'string' && !value.trim()) {
        next[key] = 'Ce champ est obligatoire';
      }
    });

    const EMAIL_PATTERN = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/;
    if (formData.email && !EMAIL_PATTERN.test(formData.email)) {
      next.email = 'Adresse email invalide';
    }
  };

  const validateByLevel = (next: Record<string, string | undefined>) => {
    if (isLicence || isMaster) {
      if (!formData.adresse.trim()) next.adresse = 'Ce champ est obligatoire';
    }
    if (isLicence) {
      if (!formData.numeroBaccalaureat.trim()) {
        next.numeroBaccalaureat = 'Ce champ est obligatoire';
      }
    }
    if (isMaster) {
      if (!formData.licenceEtablissement.trim()) {
        next.licenceEtablissement = 'Ce champ est obligatoire';
      }
      if (!formData.licenceMention.trim()) next.licenceMention = 'Ce champ est obligatoire';
    }
  };

  const validateAttachments = (next: Record<string, string | undefined>) => {
    if (isLicence && !files.releveBac && !files.attestationBac) {
      next.bacProof = 'Joignez le relevé de notes du baccalauréat ou l’attestation de réussite.';
    }
    if (isMaster && !files.releveL3) next.releveL3 = 'Le relevé de notes L3 est obligatoire';
    if (!files.cv) next.cv = 'Le CV est obligatoire';
    if (!files.lettreMotivation) next.lettreMotivation = 'Ce champ est obligatoire';
    if (!files.bordereau) next.bordereau = 'Ce champ est obligatoire';
    if (!formData.accepteConditions) next.accepteConditions = 'Veuillez accepter les conditions';
  };

  const validate = (): boolean => {
    const next: Record<string, string | undefined> = {};
    validateRequiredFields(next);
    validateByLevel(next);
    validateAttachments(next);
    setErrors(next);
    return Object.values(next).every((value) => !value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) {
      toast.error('Veuillez corriger les erreurs signalées.');
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'accepteConditions' && typeof value === 'string' && value.trim()) {
        payload.append(key, value);
      }
    });
    Object.entries(files).forEach(([kind, file]) => {
      if (file) payload.append(kind, file);
    });

    setSubmitting(true);
    setProgress(0);
    try {
      await admissionService.createAdmission(payload, setProgress);
      onSubmit?.(formData);
      toast.success('Candidature soumise avec succès ! Vous recevrez un email de confirmation.');
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Une erreur est survenue lors de la soumission. Veuillez réessayer.';
      toast.error(message, { duration: 6000 });
      setProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="overflow-hidden rounded-[1.5rem] border border-ink-100 bg-white p-6 shadow-card sm:p-10">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-brand-100 text-brand-700">
            <CheckCircle2 className="size-9" />
          </div>
          <h2 className="text-h3 text-ink-900">Candidature envoyée !</h2>
          <p className="max-w-md text-small text-ink-500">
            Votre candidature a bien été enregistrée. Un accusé de réception vous a été envoyé par
            email. Notre équipe étudiera votre dossier et vous tiendra informé de la suite.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => window.scrollTo({ top: 0 })}>
              Retour en haut
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-ink-100 bg-white p-6 shadow-card sm:p-8">
      <h2 className="mb-2 text-h3 text-ink-900">Formulaire de candidature</h2>
      <p className="mb-8 text-small text-ink-500">
        Remplissez ce formulaire pour soumettre votre candidature. Les champs marqués d'un
        astérisque (*) sont obligatoires.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <SectionTitle>Informations personnelles</SectionTitle>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                name="prenom"
                autoComplete="given-name"
                value={formData.prenom}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                name="nom"
                autoComplete="family-name"
                value={formData.nom}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleTextChange}
                required
              />
              {fieldError(errors, 'email')}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                autoComplete="tel"
                value={formData.telephone}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="dateNaissance">Date de naissance *</Label>
              <Input
                id="dateNaissance"
                name="dateNaissance"
                type="date"
                autoComplete="bday"
                value={formData.dateNaissance}
                onChange={handleTextChange}
                required
              />
            </div>
            {(isLicence || isMaster) && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="adresse">Adresse complète *</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  autoComplete="street-address"
                  placeholder="Quartier, ville, région..."
                  value={formData.adresse}
                  onChange={handleTextChange}
                />
                {fieldError(errors, 'adresse')}
              </div>
            )}
          </div>
        </div>

        <div>
          <SectionTitle>Formation souhaitée</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              name="niveau"
              label="Niveau *"
              value={formData.niveau}
              onChange={handleTextChange}
              required
            >
              <option value="">Choisir un niveau</option>
              {niveaux.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            <Select
              name="formation"
              label="Formation *"
              value={formData.formation}
              onChange={handleTextChange}
              required
            >
              <option value="">Choisir une formation</option>
              {formations.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <SectionTitle>Parcours académique</SectionTitle>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="diplomePrecedent">Dernier diplôme obtenu *</Label>
              <Input
                id="diplomePrecedent"
                name="diplomePrecedent"
                value={formData.diplomePrecedent}
                onChange={handleTextChange}
                placeholder="Ex: Baccalauréat scientifique, Licence en géographie..."
                required
              />
            </div>

            {isLicence && (
              <div className="space-y-1.5">
                <Label htmlFor="numeroBaccalaureat">Numéro d'inscription au baccalauréat *</Label>
                <Input
                  id="numeroBaccalaureat"
                  name="numeroBaccalaureat"
                  value={formData.numeroBaccalaureat}
                  onChange={(e) => {
                    setField('numeroBaccalaureat', e.target.value);
                  }}
                  onBlur={() => void checkDuplicate('numeroBaccalaureat')}
                  placeholder="Ex: BAC-2025-012345"
                />
                {fieldError(errors, 'numeroBaccalaureat')}
              </div>
            )}

            {isMaster && (
              <div className="grid gap-4 rounded-xl border border-ink-100 bg-ink-50/50 p-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="licenceEtablissement">
                    Établissement d'obtention de la Licence *
                  </Label>
                  <Input
                    id="licenceEtablissement"
                    name="licenceEtablissement"
                    value={formData.licenceEtablissement}
                    onChange={handleTextChange}
                    placeholder="Ex: Université de Fianarantsoa"
                  />
                  {fieldError(errors, 'licenceEtablissement')}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="licenceMention">Mention de la Licence *</Label>
                  <Input
                    id="licenceMention"
                    name="licenceMention"
                    value={formData.licenceMention}
                    onChange={handleTextChange}
                    placeholder="Ex: Géographie"
                  />
                  {fieldError(errors, 'licenceMention')}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="licenceAnneeObtention">Année d'obtention</Label>
                  <Input
                    id="licenceAnneeObtention"
                    name="licenceAnneeObtention"
                    type="number"
                    min={1990}
                    max={new Date().getFullYear()}
                    placeholder="Ex: 2025"
                    value={formData.licenceAnneeObtention}
                    onChange={handleTextChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <SectionTitle>Pièces justificatives</SectionTitle>
          <div className="grid gap-5 sm:grid-cols-2">
            <FilePicker
              kind="cv"
              file={files.cv ?? null}
              required
              error={errors.cv}
              onChange={(f) => setFile('cv', f)}
            />
            <FilePicker
              kind="lettreMotivation"
              file={files.lettreMotivation ?? null}
              required
              error={errors.lettreMotivation}
              onChange={(f) => setFile('lettreMotivation', f)}
            />

            {isLicence && (
              <>
                <FilePicker
                  kind="releveBac"
                  file={files.releveBac ?? null}
                  onChange={(f) => setFile('releveBac', f)}
                />
                <FilePicker
                  kind="attestationBac"
                  file={files.attestationBac ?? null}
                  onChange={(f) => setFile('attestationBac', f)}
                />
                {errors.bacProof && (
                  <p className="text-caption text-red-600 sm:col-span-2">{errors.bacProof}</p>
                )}
                <p className="flex items-start gap-2 text-caption text-ink-500 sm:col-span-2">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
                  Joignez le relevé de notes du baccalauréat ou l'attestation de réussite (au moins
                  un des deux).
                </p>
              </>
            )}

            {isMaster && (
              <FilePicker
                kind="releveL3"
                file={files.releveL3 ?? null}
                required
                error={errors.releveL3}
                onChange={(f) => setFile('releveL3', f)}
              />
            )}
          </div>
        </div>

        <div>
          <SectionTitle>Paiement — bordereau de versement</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="numeroBordereau">Numéro de bordereau de versement *</Label>
              <Input
                id="numeroBordereau"
                name="numeroBordereau"
                value={formData.numeroBordereau}
                onChange={(e) => setField('numeroBordereau', e.target.value)}
                onBlur={() => void checkDuplicate('numeroBordereau')}
                placeholder="Ex: BV-2026-000123"
              />
              {fieldError(errors, 'numeroBordereau')}
            </div>
            <FilePicker
              kind="bordereau"
              file={files.bordereau ?? null}
              required
              error={errors.bordereau}
              onChange={(f) => setFile('bordereau', f)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
          <Checkbox
            checked={formData.accepteConditions}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, accepteConditions: e.target.checked }));
              setErrors((prev) => ({ ...prev, accepteConditions: undefined }));
            }}
            label="J'accepte les conditions générales *"
          />
          <p className="mt-2 pl-6 text-small text-ink-500">
            Je certifie que les informations fournies sont exactes et je comprends que toute fausse
            déclaration peut entraîner le rejet de ma candidature.
          </p>
          {errors.accepteConditions && (
            <p className="mt-1 pl-6 text-caption text-red-600">{errors.accepteConditions}</p>
          )}
        </div>

        {loading && (
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-300"
                style={{ width: `${Math.max(progress, 8)}%` }}
              />
            </div>
            <p className="text-center text-caption text-ink-500">
              Envoi de la candidature... {progress > 0 ? `${progress}%` : ''}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Soumission en cours...' : 'Soumettre ma candidature'}
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <ArrowRight className="size-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;
