import { Info } from 'lucide-react';
import {
  ADMISSION_LEVELS,
  BAC_CATEGORIES,
  BAC_TYPES,
  type AdmissionProgram,
  type BacSeriesOption,
} from '@/config';
import type { AdmissionFormData } from '@/types';
import { FIELD_LIMITS } from '@/validation';
import { FormFieldError } from '../ui/field-error';
import { fieldA11yProps } from '@/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

type Errors = Record<string, string | undefined>;
type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

const ErrorText = ({ errors, name }: { errors: Errors; name: string }) => (
  <FormFieldError id={`${name}-error`} error={errors[name]} />
);

const Field = ({
  label,
  name,
  value,
  onChange,
  errors,
  placeholder = 'Saisir cette information',
  ...props
}: {
  label: string;
  name: keyof AdmissionFormData;
  value: string;
  onChange: ChangeHandler;
  errors: Errors;
} & Omit<React.ComponentProps<'input'>, 'name' | 'value' | 'onChange'>) => (
  <div className="space-y-1.5">
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...fieldA11yProps(String(name), errors[name])}
      {...props}
    />
    <ErrorText errors={errors} name={name} />
  </div>
);

const SelectField = ({
  name,
  label,
  value,
  onChange,
  errors,
  children,
  ...props
}: {
  name: keyof AdmissionFormData;
  label: string;
  value: string;
  onChange: ChangeHandler;
  errors: Errors;
  children: React.ReactNode;
} & Omit<React.ComponentProps<'select'>, 'name' | 'value' | 'onChange' | 'children'>) => (
  <div>
    <Select
      id={name}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      {...fieldA11yProps(String(name), errors[name])}
      {...props}
    >
      {children}
    </Select>
    <ErrorText errors={errors} name={name} />
  </div>
);

export const AdmissionSectionTitle = ({
  number,
  children,
}: {
  number?: number;
  children: React.ReactNode;
}) => (
  <div className="mb-5 flex items-center gap-3 border-b border-ink-100 pb-3">
    {number !== undefined && (
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-700 text-small font-bold text-white">
        {number}
      </span>
    )}
    <h3 className="text-h5 font-semibold text-ink-900">{children}</h3>
  </div>
);

export function PersonalInformation({
  data,
  errors,
  onChange,
  onDuplicateCheck,
}: Readonly<{
  data: AdmissionFormData;
  errors: Errors;
  onChange: ChangeHandler;
  onDuplicateCheck?: (field: 'email' | 'telephone') => void;
}>) {
  return (
    <section>
      <AdmissionSectionTitle number={1}>Informations personnelles</AdmissionSectionTitle>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <Field
          label="Nom *"
          name="nom"
          value={data.nom}
          onChange={onChange}
          errors={errors}
          autoComplete="family-name"
          placeholder="Ex : RAKOTO"
          maxLength={FIELD_LIMITS.nameMaxLength}
          required
        />
        <Field
          label="Prénom(s)"
          name="prenom"
          value={data.prenom}
          onChange={onChange}
          errors={errors}
          autoComplete="given-name"
          placeholder="Ex : Jean Pierre"
          maxLength={FIELD_LIMITS.nameMaxLength}
        />
        <Field
          label="Date de naissance *"
          name="dateNaissance"
          value={data.dateNaissance}
          onChange={onChange}
          errors={errors}
          type="date"
          autoComplete="bday"
          required
        />
        <Field
          label="Lieu de naissance *"
          name="lieuNaissance"
          value={data.lieuNaissance}
          onChange={onChange}
          errors={errors}
          placeholder="Ex : Antananarivo"
          maxLength={FIELD_LIMITS.placeMaxLength}
          required
        />
        <Field
          label="Nationalité *"
          name="nationalite"
          value={data.nationalite}
          onChange={onChange}
          errors={errors}
          autoComplete="country-name"
          maxLength={FIELD_LIMITS.nameMaxLength}
          required
        />
        <SelectField
          name="genre"
          label="Genre *"
          value={data.genre}
          onChange={onChange}
          errors={errors}
        >
          <option value="">Choisir</option>
          <option value="feminin">Féminin</option>
          <option value="masculin">Masculin</option>
          <option value="autre">Autre / préfère ne pas préciser</option>
        </SelectField>
        <Field
          label="Téléphone *"
          name="telephone"
          value={data.telephone}
          onChange={onChange}
          onBlur={() => onDuplicateCheck?.('telephone')}
          errors={errors}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Ex : 032 12 345 67"
          maxLength={FIELD_LIMITS.phoneMaxLength}
          required
        />
        <Field
          label="Email *"
          name="email"
          value={data.email}
          onChange={onChange}
          onBlur={() => onDuplicateCheck?.('email')}
          errors={errors}
          type="email"
          autoComplete="email"
          maxLength={FIELD_LIMITS.emailMaxLength}
          required
        />
        <div className="sm:col-span-2">
          <Field
            label="Adresse complète *"
            name="adresse"
            value={data.adresse}
            onChange={onChange}
            errors={errors}
            autoComplete="street-address"
            placeholder="Quartier, ville, région..."
            maxLength={FIELD_LIMITS.addressMaxLength}
            required
          />
        </div>
      </div>
    </section>
  );
}

export function BacInformation({
  data,
  series,
  errors,
  onChange,
}: Readonly<{
  data: AdmissionFormData;
  series: readonly BacSeriesOption[];
  errors: Errors;
  onChange: ChangeHandler;
}>) {
  const category = data.bacCategorie
    ? BAC_CATEGORIES[data.bacCategorie as keyof typeof BAC_CATEGORIES]
    : null;
  return (
    <section>
      <AdmissionSectionTitle number={2}>Informations sur le Baccalauréat</AdmissionSectionTitle>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <SelectField
          name="bacType"
          label="Type de baccalauréat *"
          value={data.bacType}
          onChange={onChange}
          errors={errors}
        >
          <option value="">Choisir un type</option>
          {BAC_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </SelectField>
        <SelectField
          name="bacSerie"
          label="Série du baccalauréat *"
          value={data.bacSerie}
          onChange={onChange}
          errors={errors}
          disabled={!data.bacType}
        >
          <option value="">{data.bacType ? 'Choisir une série' : "Choisir d'abord le type"}</option>
          {series.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </SelectField>
        {category && (
          <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-small text-brand-800 sm:col-span-2">
            <Info className="size-4" />
            Catégorie détectée automatiquement : <strong>{category.label.toUpperCase()}</strong>
          </div>
        )}
        <Field
          label="Numéro d'inscription au baccalauréat *"
          name="numeroBaccalaureat"
          value={data.numeroBaccalaureat}
          onChange={onChange}
          errors={errors}
          placeholder="Ex : 123456789"
          inputMode="numeric"
          maxLength={FIELD_LIMITS.bacNumberMaxLength}
          required
        />
        <Field
          label="Année d'obtention *"
          name="bacAnneeObtention"
          value={data.bacAnneeObtention}
          onChange={onChange}
          errors={errors}
          inputMode="numeric"
          placeholder="Ex : 2024"
          maxLength={4}
          required
        />
        <div className="sm:col-span-2">
          <Field
            label="Centre d'examen du baccalauréat *"
            name="bacCentreExamen"
            value={data.bacCentreExamen}
            onChange={onChange}
            errors={errors}
            placeholder="Ex : Lycée Rabearivelo, Antananarivo"
            maxLength={255}
            required
          />
        </div>
      </div>
    </section>
  );
}

export function PreviousEducationInformation({
  data,
  errors,
  onChange,
}: Readonly<{
  data: AdmissionFormData;
  errors: Errors;
  onChange: ChangeHandler;
}>) {
  if (data.niveau !== 'master') return null;
  return (
    <section>
      <AdmissionSectionTitle>Études antérieures pour le Master</AdmissionSectionTitle>
      <div className="grid gap-4 rounded-xl border border-ink-100 bg-ink-50/50 p-4 sm:grid-cols-2">
        <Field
          label="Nom de l'ancien établissement *"
          name="ancienEtablissement"
          value={data.ancienEtablissement}
          onChange={onChange}
          errors={errors}
          maxLength={255}
          required
        />
        <Field
          label="Numéro matricule *"
          name="numeroMatricule"
          value={data.numeroMatricule}
          onChange={onChange}
          errors={errors}
          maxLength={10}
          required
        />
        <Field
          label="Mention de la Licence"
          name="licenceMention"
          value={data.licenceMention}
          onChange={onChange}
          errors={errors}
          placeholder="Ex : Géographie"
          maxLength={100}
        />
        <Field
          label="Année d'obtention de la Licence"
          name="licenceAnneeObtention"
          value={data.licenceAnneeObtention}
          onChange={onChange}
          errors={errors}
          inputMode="numeric"
          placeholder="Ex : 2024"
          maxLength={4}
        />
      </div>
    </section>
  );
}

export function LevelSelection({
  data,
  errors,
  onChange,
}: Readonly<{
  data: AdmissionFormData;
  errors: Errors;
  onChange: ChangeHandler;
}>) {
  return (
    <section>
      <AdmissionSectionTitle number={3}>Formation souhaitée à l’ESSG</AdmissionSectionTitle>
      <SelectField
        name="niveau"
        label="Niveau souhaité *"
        value={data.niveau}
        onChange={onChange}
        errors={errors}
      >
        <option value="">Choisir un niveau</option>
        {ADMISSION_LEVELS.map((level) => (
          <option key={level.id} value={level.id}>
            {level.label}
          </option>
        ))}
      </SelectField>
    </section>
  );
}

export function FormationSelection({
  data,
  mentions,
  parcours,
  errors,
  onChange,
}: Readonly<{
  data: AdmissionFormData;
  mentions: AdmissionProgram[];
  parcours: AdmissionProgram[];
  errors: Errors;
  onChange: ChangeHandler;
}>) {
  const hasProfile = Boolean(data.bacSerie && data.niveau);
  return (
    <section>
      <AdmissionSectionTitle>Mention et parcours éligibles</AdmissionSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          name="mention"
          label="Mention éligible *"
          value={data.mention}
          onChange={onChange}
          errors={errors}
          disabled={!hasProfile || mentions.length === 0}
        >
          <option value="">
            {hasProfile ? 'Choisir une mention' : "Renseigner d'abord le Bac et le niveau"}
          </option>
          {mentions.map((program) => (
            <option key={program.mentionId} value={program.mentionId}>
              {program.mentionLabel}
            </option>
          ))}
        </SelectField>
        <SelectField
          name="parcours"
          label="Parcours *"
          value={data.parcours}
          onChange={onChange}
          errors={errors}
          disabled={!data.mention}
        >
          <option value="">
            {data.mention ? 'Choisir un parcours' : "Choisir d'abord une mention"}
          </option>
          {parcours.map((program) => (
            <option key={program.parcoursId} value={program.parcoursId}>
              {program.parcoursLabel}
            </option>
          ))}
        </SelectField>
        {hasProfile && mentions.length === 0 && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-small text-amber-800 sm:col-span-2">
            Aucune formation n'est actuellement ouverte pour cette catégorie de baccalauréat et ce
            niveau.
          </p>
        )}
      </div>
    </section>
  );
}
