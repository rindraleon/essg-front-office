import { apiClient, endpoints } from '@/api';
import type { PaginationParams } from '@/api/types/api';

export type ResultatPublicationType = 'excel' | 'pdf';
export type ResultatPublicationStatus = 'brouillon' | 'publie' | 'archive';
export type ResultatConsultationMode = 'public' | 'protege';

export interface ResultatPublication {
  id: number;
  titre: string;
  type: ResultatPublicationType;
  anneeScolaire: string;
  periode: string | null;
  classeFormation: string | null;
  fichierOriginal: string;
  mimeType: string;
  taille: number;
  modeConsultation: ResultatConsultationMode;
  statutPublication: ResultatPublicationStatus;
  autorisePublicationPublique: boolean;
  totalIndividuels: number;
  totalAdmis: number;
  totalAjourne: number;
  creeLe: string;
  misAJourLe: string;
}

export interface ResultatIndividuelPublic {
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
  creeLe: string;
}

export interface ResultatsIndividuelsPublicQuery extends PaginationParams {
  q?: string;
  statutAcademique?: 'admis' | 'ajourne';
}

export interface ResultatsIndividuelsPublicResponse {
  data: ResultatIndividuelPublic[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResultatsPublicQuery extends PaginationParams {
  anneeScolaire?: string;
  periode?: string;
  classeFormation?: string;
  type?: ResultatPublicationType;
}

export interface ResultatsPublicResponse {
  data: ResultatPublication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Récupère la liste paginée des publications de résultats publiées (résultat
 * global : concours, examen, sélection de dossier). Aucun jeton
 * d'authentification n'est requis.
 */
export const getResultatsPublics = async (
  query: ResultatsPublicQuery = {}
): Promise<ResultatsPublicResponse> => {
  const result = await apiClient.getList<ResultatPublication>(endpoints.resultatsPublic, {
    page: query.page ?? 1,
    limit: query.limit ?? 10,
    q: query.q || undefined,
    anneeScolaire: query.anneeScolaire || undefined,
    periode: query.periode || undefined,
    classeFormation: query.classeFormation || undefined,
    type: query.type || undefined,
    sortBy: query.sortBy ?? 'creeLe',
    sortOrder: query.sortOrder ?? 'DESC',
  });

  return {
    data: result.data,
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
    totalPages: result.meta.totalPages,
  };
};

export const getResultatPublic = async (id: number): Promise<ResultatPublication> => {
  return apiClient.get<ResultatPublication>(`${endpoints.resultatsPublic}/${id}`);
};

/**
 * Récupère les résultats individuels d’une publication diffusée en mode
 * public. Aucun code de consultation n’est requis.
 */
export const getResultatsIndividuelsPublics = async (
  publicationId: number,
  query: ResultatsIndividuelsPublicQuery = {}
): Promise<ResultatsIndividuelsPublicResponse> => {
  const result = await apiClient.getList<ResultatIndividuelPublic>(
    `${endpoints.resultatsPublic}/${publicationId}/individuels`,
    {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      q: query.q || undefined,
      statutAcademique: query.statutAcademique || undefined,
    }
  );

  return {
    data: result.data,
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
    totalPages: result.meta.totalPages,
  };
};
