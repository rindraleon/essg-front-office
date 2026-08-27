import { apiClient, API_BASE_URL , endpoints , ApiError } from '@/api';
import type { AdmissionDuplicateCheck } from '@/types';


export const ADMISSION_MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ACCEPTED_PROOF_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export function isProofFileValid(file: File): { ok: boolean; error?: string } {
  if (!ACCEPTED_PROOF_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: 'Format non autorisé : PDF, JPG ou PNG uniquement.',
    };
  }
  if (file.size > ADMISSION_MAX_FILE_SIZE) {
    return { ok: false, error: 'Fichier trop volumineux (10 Mo maximum).' };
  }
  return { ok: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function formatFileType(file: File): string {
  return file.type || 'inconnu';
}

const admissionService = {
  async createAdmission(data: FormData, onProgress?: (percent: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}${endpoints.admissions}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        let payload: unknown = null;
        try {
          payload = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        } catch {
          payload = xhr.responseText;
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
          return;
        }
        const message =
          payload && typeof payload === 'object' && 'message' in payload
            ? String((payload as { message: unknown }).message)
            : undefined;
        reject(
          new ApiError(message || 'Une erreur est survenue lors de la soumission.', {
            statusCode: xhr.status,
            kind: xhr.status === 400 ? 'validation' : 'server',
          })
        );
      };

      xhr.onerror = () => {
        const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
        reject(
          new ApiError(
            offline
              ? 'Vous êtes hors ligne. Vérifiez votre connexion Internet avant de réessayer.'
              : 'Le serveur est inaccessible. Vérifiez votre connexion.',
            { kind: 'network' }
          )
        );
      };

      xhr.ontimeout = () => {
        reject(new ApiError('La requête a expiré. Veuillez réessayer.', { kind: 'timeout' }));
      };

      xhr.timeout = 60_000;
      xhr.send(data);
    });
  },

  async checkDuplicate(params: {
    numeroBordereau?: string;
    email?: string;
    telephone?: string;
  }): Promise<AdmissionDuplicateCheck> {
    return apiClient.get<AdmissionDuplicateCheck>(endpoints.admissionsCheckDuplicate, params);
  },
};

export { admissionService };
export default admissionService;
export { admissionService as AdmissionService };
