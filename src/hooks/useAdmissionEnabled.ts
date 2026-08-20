import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';

export function useAdmissionEnabled() {
  return useQuery({ queryKey: ['settings', 'public'], queryFn: settingsService.getPublic, staleTime: 30_000 });
}
