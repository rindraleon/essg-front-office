export const ADMISSION_LEVELS = [
  { id: 'licence', label: 'Licence' },
  { id: 'master', label: 'Master' },
] as const;

export const BAC_CATEGORIES = {
  scientifique: { id: 'scientifique', label: 'Scientifique' },
  litteraire: { id: 'litteraire', label: 'Littéraire' },
  technologique: { id: 'technologique', label: 'Technologique' },
  ose: { id: 'ose', label: 'OSE' },
} as const;

export type BacCategoryId = keyof typeof BAC_CATEGORIES;
export type BacTypeId = 'general' | 'technologique';
export type AdmissionLevelId = (typeof ADMISSION_LEVELS)[number]['id'];

export type BacSeriesOption = {
  id: string;
  label: string;
  categoryId: BacCategoryId;
};

export const BAC_TYPES: ReadonlyArray<{
  id: BacTypeId;
  label: string;
  series: readonly BacSeriesOption[];
}> = [
  {
    id: 'general',
    label: 'Général',
    series: [
      { id: 'a1', label: 'Série A1', categoryId: 'litteraire' },
      { id: 'a2', label: 'Série A2', categoryId: 'litteraire' },
      { id: 'c', label: 'Série C', categoryId: 'scientifique' },
      { id: 'd', label: 'Série D', categoryId: 'scientifique' },
      { id: 'l', label: 'Série L', categoryId: 'litteraire' },
      { id: 's', label: 'Série S', categoryId: 'scientifique' },
      { id: 'ose', label: 'Série OSE', categoryId: 'ose' },
    ],
  },
  {
    id: 'technologique',
    label: 'Technologique',
    series: [
      { id: 'tgc', label: 'TGC — Génie Civil', categoryId: 'technologique' },
      { id: 'tgi', label: 'TGI — Industriel', categoryId: 'technologique' },
      { id: 'tter', label: 'TTER — Tertiaire', categoryId: 'technologique' },
    ],
  },
];

export type AdmissionProgram = {
  id: string;
  levelId: AdmissionLevelId;
  mentionId: string;
  mentionLabel: string;
  parcoursId: string;
  parcoursLabel: string;
  allowedBacCategories: readonly BacCategoryId[];
};

const PROGRAM_TEMPLATES = [
  {
    mentionId: 'geoinformatique',
    mentionLabel: 'Géoinformatique',
    parcours: [{ id: 'geomatique-teledetection', label: 'Géomatique et Télédétection' }],
    categories: ['scientifique', 'technologique', 'ose'] as const,
  },
  {
    mentionId: 'geomatique-applications',
    mentionLabel: 'Géomatique et Applications',
    parcours: [
      { id: 'geomatique-geologie-economique', label: 'Géomatique et Géologie économique' },
      { id: 'geomatique-agriculture-durable', label: 'Géomatique et Agriculture durable' },
      {
        id: 'geomatique-ecosystemes',
        label: 'Géomatique, Écosystèmes terrestres et aquatiques',
      },
    ],
    categories: ['scientifique', 'technologique', 'ose'] as const,
  },
  {
    mentionId: 'geomatique-management',
    mentionLabel: 'Géomatique et Management',
    parcours: [
      {
        id: 'geomatique-communication-marketing',
        label: 'Géomatique, Communication et Marketing',
      },
      {
        id: 'geomatique-genre-inclusion-developpement',
        label: 'Géomatique, Genre, Inclusion et Développement durable',
      },
    ],
    categories: ['scientifique', 'litteraire', 'technologique', 'ose'] as const,
  },
] as const;

const ADMISSION_PROGRAMS: readonly AdmissionProgram[] = ADMISSION_LEVELS.flatMap((level) =>
  PROGRAM_TEMPLATES.flatMap((mention) =>
    mention.parcours.map((parcours) => ({
      id: `${level.id}:${mention.mentionId}:${parcours.id}`,
      levelId: level.id,
      mentionId: mention.mentionId,
      mentionLabel: mention.mentionLabel,
      parcoursId: parcours.id,
      parcoursLabel: parcours.label,
      allowedBacCategories: mention.categories,
    }))
  )
);

export function getBacSeries(typeId: string): readonly BacSeriesOption[] {
  return BAC_TYPES.find((type) => type.id === typeId)?.series ?? [];
}

export function getBacCategory(typeId: string, seriesId: string): BacCategoryId | '' {
  return getBacSeries(typeId).find((series) => series.id === seriesId)?.categoryId ?? '';
}

export function getEligiblePrograms(levelId: string, categoryId: string): AdmissionProgram[] {
  return ADMISSION_PROGRAMS.filter(
    (program) =>
      program.levelId === levelId &&
      program.allowedBacCategories.includes(categoryId as BacCategoryId)
  );
}

export function getRequiredDocumentIds(
  levelId: string,
  bacYear: string,
  currentYear: number
): string[] {
  const common = ['demandeInscription', 'bordereau', 'photoIdentite', 'acteEtatCivil'];
  const bacDocument = Number(bacYear) === currentYear ? 'releveBac' : 'diplomeBac';
  return levelId === 'master'
    ? [...common, bacDocument, 'attestationEtablissement']
    : [...common, bacDocument];
}
