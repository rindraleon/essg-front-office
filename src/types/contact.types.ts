import type { ReactNode } from 'react';

export type ContactInfoItem = {
  id: string;
  icon: ReactNode;
  title: string;
  lines: string[];
};

export type ContactInfoCardsProps = {
  items?: ContactInfoItem[];
};

export type ContactFormData = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
};

export type ContactFormProps = {
  sujets?: { value: string; label: string }[];
  onSubmit?: (data: ContactFormData) => void;
};

export interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ContactPageProps = {
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
  mapLat?: number;
  mapLng?: number;
  mapLabel?: string;
  mapAdresse?: string;
};
