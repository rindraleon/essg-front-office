import { useCallback, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  IdCard,
  LoaderCircle,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fieldA11yProps, toUpperName } from '@/utils';
import type { ContactFormData, ContactFormProps } from '@/types';
import { useCreateContact } from '@/hooks';
import {
  mapApiErrorToFormErrors,
  normalizeContactPayload,
  sanitizePhoneInput,
  validateContactField,
  validateContactForm,
  validationMessages,
  type ContactFormField,
} from '@/validation';
import { verifyEmailDomain } from '@/services/contact.service';
import { Button } from '../ui/button';
import { FormFieldError } from '../ui/field-error';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

const INITIAL_FORM_DATA: ContactFormData = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  sujet: '',
  message: '',
};

const DEFAULT_SUJETS = [
  { value: 'information', label: "Demande d'information" },
  { value: 'admission', label: 'Admission' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'autre', label: 'Autre' },
];

const FORM_FIELDS = Object.keys(INITIAL_FORM_DATA) as ContactFormField[];

const ContactForm = ({ sujets = DEFAULT_SUJETS, onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);
  /** Champs touchés (perte de focus) : l'erreur n'apparaît qu'après interaction. */
  const [touched, setTouched] = useState<Partial<Record<ContactFormField, boolean>>>({});
  /** Tentative de soumission : toutes les erreurs sont affichées. */
  const [submitAttempted, setSubmitAttempted] = useState(false);
  /** Erreurs serveur (vérification email, rejet API) rattachées à un champ. */
  const [serverErrors, setServerErrors] = useState<Partial<Record<ContactFormField, string>>>({});
  const lastVerifiedEmailRef = useRef('');
  const formRef = useRef<HTMLFormElement>(null);
  const createContact = useCreateContact();
  const loading = createContact.isPending;

  const fieldErrors = useMemo(() => validateContactForm(formData), [formData]);

  /** Erreur visible : erreur serveur immédiate, sinon erreur de format après blur/submit. */
  const errorOf = useCallback(
    (field: ContactFormField): string | undefined =>
      serverErrors[field] ?? (touched[field] || submitAttempted ? fieldErrors[field] : undefined),
    [serverErrors, touched, submitAttempted, fieldErrors]
  );

  const checkEmailDomain = useCallback(async (email: string): Promise<void> => {
    const trimmed = email.trim().toLowerCase();
    // Vérification serveur uniquement si la syntaxe est valide et l'adresse a changé.
    if (
      !trimmed ||
      validateContactField('email', trimmed) ||
      lastVerifiedEmailRef.current === trimmed
    ) {
      return;
    }
    lastVerifiedEmailRef.current = trimmed;
    try {
      const result = await verifyEmailDomain(trimmed);
      setServerErrors((previous) => ({
        ...previous,
        email:
          result?.valide === false
            ? result.raison || validationMessages.emailUnverified
            : undefined,
      }));
    } catch {
      // Indisponibilité du service de vérification : on ne bloque pas la saisie.
    }
  }, []);

  const formatContactValue = (field: ContactFormField, value: string): string => {
    if (field === 'nom') return toUpperName(value);
    if (field === 'telephone') return sanitizePhoneInput(value);
    return value;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = name as ContactFormField;
    setServerErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormData((prev) => ({ ...prev, [field]: formatContactValue(field, value) }));
  };

  /** Blur délégué au <form> : marque le champ comme touché et déclenche les contrôles serveur. */
  const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as EventTarget & { name?: string; value?: string };
    const field = target.name as ContactFormField | undefined;
    if (!field || !FORM_FIELDS.includes(field)) return;
    setTouched((previous) => ({ ...previous, [field]: true }));
    if (field === 'email') void checkEmailDomain(target.value ?? '');
  };

  const focusFirstError = (errors: Record<string, string | undefined>) => {
    const firstField = FORM_FIELDS.find((field) => errors[field]);
    if (!firstField) return;
    window.requestAnimationFrame(() => {
      const element = formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element?.focus({ preventScroll: true });
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const errors = validateContactForm(formData);
    if (Object.keys(errors).length > 0) {
      focusFirstError(errors);
      return;
    }
    const payload = normalizeContactPayload(formData);
    try {
      await createContact.mutateAsync(payload);
      onSubmit?.(payload);
      toast.success('Message envoyé avec succès !', {
        duration: 5000,
        position: 'top-right',
      });
      setSubmitted(true);
    } catch (error) {
      // Rattachement de l'erreur au champ concerné quand c'est possible, toast global sinon.
      const { fieldErrors: mapped, globalMessage } = mapApiErrorToFormErrors(error, FORM_FIELDS);
      if (Object.keys(mapped).length > 0) {
        setServerErrors((previous) => ({ ...previous, ...mapped }));
        setTouched((previous) => ({
          ...previous,
          ...Object.fromEntries(Object.keys(mapped).map((field) => [field, true])),
        }));
        return;
      }
      toast.error(globalMessage ?? validationMessages.apiGeneric, {
        duration: 5000,
        position: 'top-right',
      });
    }
  };

  if (submitted) {
    return (
      <div className="h-full overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-brand-100 text-brand-700">
            <CheckCircle2 className="size-9" />
          </div>
          <h2 className="text-h4 font-bold text-ink-900">Message envoyé !</h2>
          <p className="max-w-md text-small text-ink-500">
            Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais à
            l'adresse indiquée.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setFormData(INITIAL_FORM_DATA);
              setTouched({});
              setServerErrors({});
              setSubmitAttempted(false);
              lastVerifiedEmailRef.current = '';
            }}
          >
            Envoyer un autre message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden rounded-2xl border border-ink-100 bg-white p-4 shadow-card sm:p-6">
      <div className="mb-4">
        <h2 className="mb-1 text-h4 font-bold text-ink-900">Envoyez-nous un message</h2>
        <p className="text-caption text-ink-500">
          Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs
          délais.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        noValidate
        className="space-y-4"
      >
        <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <User className="size-4" />
            </div>
            <h3 className="text-body font-semibold text-ink-900">Vos informations</h3>
          </div>

          <div className="grid items-start gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prenom">Prénom</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-500" />
                <Input
                  id="prenom"
                  name="prenom"
                  autoComplete="given-name"
                  value={formData.prenom}
                  onChange={handleChange}
                  maxLength={100}
                  className="pl-9"
                  {...fieldA11yProps('prenom', errorOf('prenom'))}
                />
              </div>
              <FormFieldError id="prenom-error" error={errorOf('prenom')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom">Nom *</Label>
              <div className="relative">
                <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-500" />
                <Input
                  id="nom"
                  name="nom"
                  autoComplete="family-name"
                  value={formData.nom}
                  onChange={handleChange}
                  maxLength={100}
                  className="pl-9"
                  {...fieldA11yProps('nom', errorOf('nom'))}
                />
              </div>
              <FormFieldError id="nom-error" error={errorOf('nom')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={50}
                  className="pl-9"
                  {...fieldA11yProps('email', errorOf('email'))}
                />
              </div>
              <FormFieldError id="email-error" error={errorOf('email')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telephone">Téléphone</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-500" />
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="032 12 345 67 ou +261 32 12 345 67"
                  value={formData.telephone}
                  onChange={handleChange}
                  maxLength={20}
                  inputMode="tel"
                  className="pl-9"
                  {...fieldA11yProps('telephone', errorOf('telephone'))}
                />
              </div>
              <FormFieldError id="telephone-error" error={errorOf('telephone')} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <MessageSquare className="size-4" />
            </div>
            <h3 className="text-body font-semibold text-ink-900">Votre demande</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Select
                id="sujet"
                name="sujet"
                label="Sujet *"
                value={formData.sujet}
                onChange={handleChange}
                {...fieldA11yProps('sujet', errorOf('sujet'))}
              >
                <option value="">Choisir un sujet</option>
                {sujets.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <FormFieldError id="sujet-error" error={errorOf('sujet')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre demande avec le plus de précision possible..."
                maxLength={1000}
                {...fieldA11yProps('message', errorOf('message'))}
              />
              <FormFieldError id="message-error" error={errorOf('message')} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" disabled={loading} className="w-full sm:min-w-[220px]">
            {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
