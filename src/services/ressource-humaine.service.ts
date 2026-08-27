import { apiClient , endpoints } from '@/api';
import type { PaginatedResult } from '@/api';
import type { RessourceHumaine } from '@/types';

const ressourceHumaineService = {
  findAll(
    page = 1,
    limit = 100,
    query = '',
    poste = '',
    signal?: AbortSignal
  ): Promise<PaginatedResult<RessourceHumaine>> {
    const endpoint = query.trim() ? endpoints.staffSearch : endpoints.staff;
    return apiClient.getList<RessourceHumaine>(
      endpoint,
      {
        page,
        limit,
        q: query.trim() || undefined,
        poste: poste && poste !== 'all' ? poste : undefined,
        sortBy: 'creeLe',
        sortOrder: 'DESC',
      },
      signal
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
    signal?: AbortSignal
  ): Promise<PaginatedResult<RessourceHumaine>> {
    return apiClient.getList<RessourceHumaine>(
      endpoints.staffSearch,
      { q: query, page, limit },
      signal
    );
  },

  async findActive(signal?: AbortSignal): Promise<RessourceHumaine[]> {
    const result = await ressourceHumaineService.findAll(1, 100, '', '', signal);
    return result.data.filter((item) => item.actif !== false);
  },
};

export default ressourceHumaineService;
