import { apiClient } from '@/api/client/http';
import { endpoints } from '@/api/endpoints';

export interface AdmissionSettings {
  admissionsOuvertes: boolean;
}

export const getAdmissionSettings = (signal?: AbortSignal): Promise<AdmissionSettings> =>
  apiClient.get<AdmissionSettings>(endpoints.settingsPublic, undefined, signal);

const settingsService = { getAdmissionSettings };

export default settingsService;
