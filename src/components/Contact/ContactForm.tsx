import { useState } from 'react';
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
import { toUpperName } from '../../utils/slug.utils';
import type { ContactFormData, ContactFormProps } from '../../types/contact.types';
import { useCreateContact } from '../../hooks/mutations';
import { ApiError } from '@/api/types/api';
import { Button } from '../ui/button';
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

const ContactForm = ({ sujets = DEFAULT_SUJETS, onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);
  const createContact = useCreateContact();
  const loading = createContact.isPending;

  if (submitted) {
    return (
      <div className="h-full overflow-hidden rounded-[1.5rem] border border-ink-100 bg-white p-6 shadow-card sm:p-8">
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
            }}
          >
            Envoyer un autre message
          </Button>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nom' ? toUpperName(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createContact.mutateAsync(formData);
      onSubmit?.(formData);
      toast.success('Message envoyé avec succès !', {
        duration: 5000,
        position: 'top-right',
      });
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.";
      toast.error(message, { duration: 5000, position: 'top-right' });
    }
  };

  return (
    <div className="h-full overflow-hidden rounded-[1.5rem] border border-ink-100 bg-white p-4 shadow-card sm:p-6">
      <div className="mb-4">
        <h2 className="mb-1 text-h4 font-bold text-ink-900">Envoyez-nous un message</h2>
        <p className="text-caption text-ink-500">
          Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs
          délais.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
                  required
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom">Nom</Label>
              <div className="relative">
                <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-500" />
                <Input
                  id="nom"
                  name="nom"
                  autoComplete="family-name"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
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
                  required
                  className="pl-9"
                />
              </div>
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
                  placeholder="+261 3X XXX XX"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
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
            <Select
              name="sujet"
              label="Sujet"
              value={formData.sujet}
              onChange={handleChange}
              required
            >
              <option value="">Choisir un sujet</option>
              {sujets.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Décrivez votre demande avec le plus de précision possible..."
              />
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
