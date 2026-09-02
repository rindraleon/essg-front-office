import { apiClient, endpoints } from '@/api';
import type { ContactFormData } from '@/types';

export const createContactMessage = async (data: ContactFormData): Promise<void> => {
  await apiClient.post(endpoints.messages, data);
};
