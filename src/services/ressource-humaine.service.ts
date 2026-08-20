import { apiClient } from '@/api/client/http';
import { endpoints } from '@/api/endpoints';
import type { PaginatedResult } from '@/api/types/api';
import type { RessourceHumaine } from '../types/ressource-humaine.types';

const ressourceHumaineService = {
  findAll(page = 1, limit = 100, signal?: AbortSignal): Promise<PaginatedResult<RessourceHumaine>> {
    return apiClient.getList<RessourceHumaine>(
      endpoints.staff,
      { page, limit, sortBy: 'ordre', sortOrder: 'ASC' },
      signal,
    );
  },

  findOne(id: number, signal?: AbortSignal): Promise<RessourceHumaine> {
    return apiClient.get<RessourceHumaine>(endpoints.staffById(id), undefined, signal);
  },

  findBySlug(slug: string, signal?: AbortSignal): Promise<RessourceHumaine> {
    return apiClient.get<RessourceHumaine>(endpoints.staffBySlug(slug), undefined, signal);
  },

  search(
    query: string,
    page = 1,
    limit = 10,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<RessourceHumaine>> {
    return apiClient.getList<RessourceHumaine>(
      endpoints.staffSearch,
      { q: query, page, limit },
      signal,
    );
  },

  async findActive(signal?: AbortSignal): Promise<RessourceHumaine[]> {
    const result = await ressourceHumaineService.findAll(1, 100, signal);
    return result.data.filter((item) => item.actif !== false);
  },
};

export default ressourceHumaineService;
