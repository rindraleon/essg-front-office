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
          {
            value: 'taef',
            label: 'TAEF — Agricole, Élevage et Forêts',
            category: 'technologique',
          },
          { value: 'tter', label: 'TTER — Tertiaire', category: 'technologique' },
        ],
      },
    ],
  },
  levels: [
    { value: 'licence', label: 'Licence' },
    // { value: 'master', label: 'Master' } // Uncomment if Master level is needed
  ],
  categories: {
    scientifique: { value: 'scientifique', label: 'Scientifique' },
    litteraire: { value: 'litteraire', label: 'Littéraire' },
    technologique: { value: 'technologique', label: 'Technologique' },
    ose: { value: 'ose', label: 'OSE' },
  },

  series: {

    scientifiqueTechnique: ['c', 'd', 's', 'tgc', 'tgi'],

    scientifiqueAgricole: ['c', 'd', 's', 'taef'],

    toutesSeries: ['a1', 'a2', 'c', 'd', 'l', 's', 'ose', 'tgc', 'tgi', 'taef', 'tter'],
  },
  programs: [
    {
      mention: 'geoinformatique',
      mentionLabel: 'Géoinformatique',
      parcours: [
        {
          value: 'geomatique-teledetection',
          label: 'Géomatique et Télédétection',
          series: 'scientifiqueTechnique',
        },
      ],
    },
    {
      mention: 'geomatique-applications',
      mentionLabel: 'Géomatique et Applications',
      parcours: [
        {
          value: 'geomatique-geologie-economique',
          label: 'Géomatique et Géologie économique',
          series: 'scientifiqueTechnique',
        },
        {
          value: 'geomatique-agriculture-durable',
          label: 'Géomatique et Agriculture durable',
          series: 'scientifiqueAgricole',
        },
        {
          value: 'geomatique-ecosystemes',
          label: 'Géomatique, Écosystèmes terrestres et aquatiques',
          series: 'scientifiqueTechnique',
        },
      ],
    },
    {
      mention: 'geomatique-management',
      mentionLabel: 'Géomatique et Management',
      parcours: [
        {
          value: 'geomatique-communication-marketing',
          label: 'Géomatique, Communication et Marketing',
          series: 'toutesSeries',
        },
        {
          value: 'geomatique-genre-inclusion-developpement',
          label: 'Géomatique, Genre, Inclusion et Développement durable',
          series: 'toutesSeries',
        },
      ],
    },
  ],
} as const;

export type BacCategoryId = keyof typeof ADMISSION_CONFIG.categories;
export type BacTypeId = (typeof ADMISSION_CONFIG.bac.types)[number]['value'];
export type AdmissionLevelId = (typeof ADMISSION_CONFIG.levels)[number]['value'];
export type BacSeriesGroupId = keyof typeof ADMISSION_CONFIG.series;

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
  allowedBacSeries: readonly string[];
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
      allowedBacSeries: ADMISSION_CONFIG.series[parcours.series as BacSeriesGroupId],
    }))
  )
);

export function getBacSeries(typeId: string): readonly BacSeriesOption[] {
  return BAC_TYPES.find((type) => type.id === typeId)?.series ?? [];
}

export function getBacCategory(typeId: string, seriesId: string): BacCategoryId | '' {
  return getBacSeries(typeId).find((series) => series.id === seriesId)?.categoryId ?? '';
}

export function getEligiblePrograms(levelId: string, seriesId: string): AdmissionProgram[] {
  const normalizedSeries = seriesId.trim().toLowerCase();
  return ADMISSION_PROGRAMS.filter(
    (program) => program.levelId === levelId && program.allowedBacSeries.includes(normalizedSeries)
  );
}

export function getRequiredDocumentIds(levelId: string): string[] {
  const common = ['demandeInscription', 'bordereau', 'photoIdentite', 'acteEtatCivil', 'releveBac'];
  return levelId === 'master' ? [...common, 'attestationEtablissement'] : common;
}

export function getOptionalDocumentIds(): string[] {
  return ['diplomeBac'];
}

export const ADMISSION_SOURCES = [
  { value: 'soifee', label: 'SOIFEE' },
  { value: 'evenement-universite', label: 'Évènement université' },
  { value: 'radio', label: 'Radio' },
  { value: 'salon-tana', label: 'Salon Tana' },
  { value: 'recommandation', label: 'Recommandation' },
] as const;

export type AdmissionSourceId = (typeof ADMISSION_SOURCES)[number]['value'];

export const ADMISSION_DOCUMENT = {
  url: '/files/fiche-renseignement-recu-2026-essg.pdf',
  fileName: 'FICHE-RENSEIGNEMENT-RECU-2026-ESSG.pdf',
  label: "Télécharger le document d'admission",
} as const;
