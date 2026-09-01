import type { ReactNode } from 'react';

export type FaqItem = {
  question: string;
  reponse: string;
};

export type FaqAccordionProps = {
  faqs: FaqItem[];
};

export type ContactCardProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryLink?: string;
  secondaryLabel?: string;
  secondaryLink?: string;
};

export type FaqPageProps = {
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
  faqs?: FaqItem[];
};
