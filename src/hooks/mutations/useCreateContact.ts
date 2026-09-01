import { useMutation } from '@tanstack/react-query';
import { createContactMessage } from '@/services';
import type { ContactFormData } from '@/types';

export function useCreateContact() {
  return useMutation({
    mutationKey: ['messages', 'create'],
    mutationFn: (data: ContactFormData) => createContactMessage(data),
  });
}
