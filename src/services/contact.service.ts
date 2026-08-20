import { apiClient } from '@/api/client/http';
import { endpoints } from '@/api/endpoints';
import type { ContactFormData } from '../types/contact.types';

export const createContactMessage = async (data: ContactFormData): Promise<void> => {
  await apiClient.post(endpoints.messages, data);
};
