import { useMutation } from '@tanstack/react-query';
import { admissionService } from '../../services';

export function useCreateAdmission() {
  return useMutation({
    mutationKey: ['admissions', 'create'],
    mutationFn: (data: FormData) => admissionService.createAdmission(data),
  });
}
