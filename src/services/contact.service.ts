import { apiClient, endpoints } from '@/api';
import type { ContactFormData } from '@/types';

export type EmailDomainCheck = {
  valide: boolean;
  raison: string | null;
};

export const createContactMessage = async (data: ContactFormData): Promise<void> => {
  await apiClient.post(endpoints.messages, data);
};

export const verifyEmailDomain = async (email: string): Promise<EmailDomainCheck | null> => {
  try {
    return await apiClient.get<EmailDomainCheck>(endpoints.verifyEmail, { email });
  } catch {
    return null;
  }
};
