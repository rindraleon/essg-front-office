import type { ReactNode } from 'react';

export type HeroStatItem = {
  value: string;
  label: string;
  icon?: ReactNode;
};

export type PageHeroProps = {
  image?: string;
  imageAlt?: string;
  title: string;
  description?: string;
  stats?: HeroStatItem[];
  minHeight?: string;
};

export type ActiveFilterChip = {
  key: string;
  label: string;
  onDelete: () => void;
};

export type FilterToolbarProps = {
  resultText: string;
  showFilters: boolean;
  activeFilterCount?: number;
  hasActiveFilters?: boolean;
  activeFilterChips?: ActiveFilterChip[];
  onToggleFilters: () => void;
  onResetFilters: () => void;
  children?: ReactNode;
  searchEnabled?: boolean;
  showSearch?: boolean;
  searchIsActive?: boolean;
  onToggleSearch?: () => void;
  searchContent?: ReactNode;
};

export type EmptyStateProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export type CtaSectionProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryLabel: string;
  primaryLink: string;
  primaryIsMailto?: boolean;
  secondaryLabel?: string;
  secondaryLink?: string;
};
