export type ProjetLocation = {
  ville: string;
  pays: string;
  adresse?: string;
  lat: number;
  lng: number;
};

export type ProjectSource = {
  title: string;
  url: string;
};

export type ProjetItem = {
  id: string;
  titre: string;
  type: string;
  statut: string;
  annee: string;
  slug: string;
  description: string;
  budget?: string;
  partenaires: string[];
  objectifs?: string[];
  image?: string;
  sources?: ProjectSource[];
  galerie?: string[];
  location?: ProjetLocation;
};

export type ProjetCardProps = {
  projet: ProjetItem;
  detailLinkBase?: string;
};

export type ProjetDetailModalProps = {
  projet: ProjetItem | null;
  open: boolean;
  onClose: () => void;
};

export type MapEmbedProps = {
  lat: number;
  lng: number;
  label: string;
  adresse?: string;
  zoom?: 'close' | 'city' | 'region';
  height?: number;
};

export type ProjetsPageProps = {
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
  projets?: ProjetItem[];
};

export type FeaturedProjetItem = {
  id: string;
  titre: string;
  statut: string;
  type: string;
  annee: string;
  description: string;
  partenaires: string[];
  slug: string;
  image?: string;
  budget?: string;
  objectifs?: string[];
  sources?: ProjectSource[];
  galerie?: string[];
  location?: ProjetLocation;
};

export type FeaturedProjetsSectionProps = {
  title?: string;
  description?: string;
  featuredProjets?: FeaturedProjetItem[];
};
