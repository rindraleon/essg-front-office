import { useQuery } from '@tanstack/react-query';
import { getAdmissionSettings } from '@/services';

export function useAdmissionsSettings() {
  return useQuery({
    queryKey: ['settings', 'admissions'],
    queryFn: ({ signal }) => getAdmissionSettings(signal),
    staleTime: 60_000,
    retry: 2,
  });
}

export function useAdmissionsOuvertes(): boolean {
  const { data } = useAdmissionsSettings();
  return data?.admissionsOuvertes ?? true;
}
