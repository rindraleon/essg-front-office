export type PartenaireItem = {
  id: number | string;
  slug?: string;
  nom: string;
  type: 'Entreprise' | 'Institution' | 'Organisation' | 'Autre' | string;
  pays?: string;
  secteur?: string;
  description?: string;
  siteWeb?: string;
  logo?: string;
  contact?: string;
  dateDebut?: string;
  creeLe?: string;
  misAJourLe?: string;
};

export type PartenaireCardProps = {
  partenaire: PartenaireItem;
};

export type PartenaireTypeOption = {
  value: string;
  label: string;
};

export type PartenaireStat = {
  value: string;
  label: string;
};

export type PartenairesPageProps = {
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
  stats?: PartenaireStat[];
  types?: PartenaireTypeOption[];
  partenaires?: PartenaireItem[];
};

export type PartenairesSectionProps = {
  title?: string;
  description?: string;
  maxItems?: number;
  partenaires?: PartenaireItem[];
};
