import { apiClient, endpoints } from '@/api';
import type { PaginatedResult } from '@/api';
import type { Formation } from '@/types';

const formationService = {
  findAll(page = 1, limit = 6, signal?: AbortSignal): Promise<PaginatedResult<Formation>> {
    return apiClient.getList<Formation>(
      endpoints.formations,
      { page, limit, sortBy: 'creeLe', sortOrder: 'DESC' },
      signal
    );
  },

  findOne(id: number, signal?: AbortSignal): Promise<Formation> {
    return apiClient.get<Formation>(endpoints.formationById(id), undefined, signal);
  },

  findBySlug(slug: string, signal?: AbortSignal): Promise<Formation> {
    return apiClient.get<Formation>(endpoints.formationBySlug(slug), undefined, signal);
  },

  search(
    query: string,
    page = 1,
    limit = 10,
    signal?: AbortSignal
  ): Promise<PaginatedResult<Formation>> {
    return apiClient.getList<Formation>(
      endpoints.formationSearch,
      { q: query, page, limit },
      signal
    );
  },

  async findFeatured(limit = 6, signal?: AbortSignal): Promise<Formation[]> {
    const result = await apiClient.getList<Formation>(
      endpoints.formations,
      { page: 1, limit, sortBy: 'id', sortOrder: 'DESC' },
      signal
    );
    return result.data.filter((item) => item.enVedette).slice(0, limit);
  },
};

export default formationService;
