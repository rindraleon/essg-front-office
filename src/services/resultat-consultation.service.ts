import { apiClient, endpoints } from '@/api';
import type { ResultatPublication } from './resultats-public.service';

export interface IndividuResultat {
  id: number;
  publicationId: number;
  matricule: string;
  nom: string;
  prenom: string;
  classe: string | null;
  periode: string | null;
  notes: Record<string, unknown> | null;
  moyenne: number | string | null;
  statutAcademique: 'admis' | 'ajourne' | null;
  observation: string | null;
  codeConsultation: string | null;
  creeLe: string;
}

export interface ConsultationResultat {
  publication: ResultatPublication;
  individu: IndividuResultat;
}

/**
 * Consulte un résultat individuel publié (public) par matricule + code de
 * consultation. Lève une erreur si aucun résultat publié ne correspond.
 */
export const consulterResultat = async (
  matricule: string,
  code: string
): Promise<ConsultationResultat> => {
  return apiClient.get<ConsultationResultat>(endpoints.resultatsConsultation, {
    matricule,
    code,
  });
};
