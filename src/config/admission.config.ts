
export const ADMISSION_CONFIG = {
  bac: {
    types: [
      {
        value: 'general',
        label: 'Baccalauréat Général',
        series: [
          { value: 'a1', label: 'Série A1', category: 'litteraire' },
          { value: 'a2', label: 'Série A2', category: 'litteraire' },
          { value: 'c', label: 'Série C', category: 'scientifique' },
          { value: 'd', label: 'Série D', category: 'scientifique' },
          { value: 'l', label: 'Série L', category: 'litteraire' },
          { value: 's', label: 'Série S', category: 'scientifique' },
          { value: 'ose', label: 'Série OSE', category: 'ose' },
        ],
      },
      {
        value: 'technologique',
        label: 'Baccalauréat Technique',
        series: [
          { value: 'tgc', label: 'TGC — Génie Civil', category: 'technologique' },
          { value: 'tgi', label: 'TGI — Industriel', category: 'technologique' },
          { value: 'tter', label: 'TTER — Tertiaire', category: 'technologique' },
        ],
      },
    ],
  },
  levels: [
    { value: 'licence', label: 'Licence' },
    { value: 'master', label: 'Master' },
  ],
  categories: {
    scientifique: { value: 'scientifique', label: 'Scientifique' },
    litteraire: { value: 'litteraire', label: 'Littéraire' },
    technologique: { value: 'technologique', label: 'Technologique' },
    ose: { value: 'ose', label: 'OSE' },
  },
  programs: [
    {
      mention: 'geoinformatique',
      mentionLabel: 'Géoinformatique',
      parcours: [{ value: 'geomatique-teledetection', label: 'Géomatique et Télédétection' }],
      categories: ['scientifique', 'technologique'],
    },
    {
      mention: 'geomatique-applications',
      mentionLabel: 'Géomatique et Applications',
      parcours: [
        { value: 'geomatique-geologie-economique', label: 'Géomatique et Géologie économique' },
        { value: 'geomatique-agriculture-durable', label: 'Géomatique et Agriculture durable' },
        {
          value: 'geomatique-ecosystemes',
          label: 'Géomatique, Écosystèmes terrestres et aquatiques',
        },
      ],
      categories: ['scientifique', 'technologique'],
    },
    {
      mention: 'geomatique-management',
      mentionLabel: 'Géomatique et Management',
      parcours: [
        {
          value: 'geomatique-communication-marketing',
          label: 'Géomatique, Communication et Marketing',
        },
        {
          value: 'geomatique-genre-inclusion-developpement',
          label: 'Géomatique, Genre, Inclusion et Développement durable',
        },
      ],
      categories: ['scientifique', 'litteraire', 'technologique', 'ose'],
    },
  ],
} as const;

export type BacCategoryId = keyof typeof ADMISSION_CONFIG.categories;
export type BacTypeId = (typeof ADMISSION_CONFIG.bac.types)[number]['value'];
export type AdmissionLevelId = (typeof ADMISSION_CONFIG.levels)[number]['value'];

export type BacSeriesOption = {
  id: string;
  label: string;
  categoryId: BacCategoryId;
};

export type AdmissionProgram = {
  id: string;
  levelId: AdmissionLevelId;
  mentionId: string;
  mentionLabel: string;
  parcoursId: string;
  parcoursLabel: string;
  allowedBacCategories: readonly BacCategoryId[];
};

export const ADMISSION_LEVELS = ADMISSION_CONFIG.levels.map(({ value, label }) => ({
  id: value,
  label,
})) as Array<{ id: AdmissionLevelId; label: string }>;

export const BAC_CATEGORIES: Record<BacCategoryId, { id: BacCategoryId; label: string }> =
  Object.fromEntries(
    (Object.keys(ADMISSION_CONFIG.categories) as BacCategoryId[]).map((key) => [
      key,
      { id: key, label: ADMISSION_CONFIG.categories[key].label },
    ])
  ) as Record<BacCategoryId, { id: BacCategoryId; label: string }>;

export const BAC_TYPES: ReadonlyArray<{
  id: BacTypeId;
  label: string;
  series: readonly BacSeriesOption[];
}> = ADMISSION_CONFIG.bac.types.map((type) => ({
  id: type.value,
  label: type.label,
  series: type.series.map((serie) => ({
    id: serie.value,
    label: serie.label,
    categoryId: serie.category,
  })),
}));

const ADMISSION_PROGRAMS: readonly AdmissionProgram[] = ADMISSION_LEVELS.flatMap((level) =>
  ADMISSION_CONFIG.programs.flatMap((mention) =>
    mention.parcours.map((parcours) => ({
      id: `${level.id}:${mention.mention}:${parcours.value}`,
      levelId: level.id,
      mentionId: mention.mention,
      mentionLabel: mention.mentionLabel,
      parcoursId: parcours.value,
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
