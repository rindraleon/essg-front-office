import { apiClient } from '@/api/client/http';
import { endpoints } from '@/api/endpoints';
import type { PaginatedResult } from '@/api/types/api';
import type { Actualite } from '../types/actualite.types';

const actualiteService = {
  findAll(page = 1, limit = 10, signal?: AbortSignal): Promise<PaginatedResult<Actualite>> {
    return apiClient.getList<Actualite>(
      endpoints.news,
      { page, limit, sortBy: 'date', sortOrder: 'DESC' },
      signal,
    );
  },

  findOne(id: number, signal?: AbortSignal): Promise<Actualite> {
    return apiClient.get<Actualite>(endpoints.newsById(id), undefined, signal);
  },

  findBySlug(slug: string, signal?: AbortSignal): Promise<Actualite> {
    return apiClient.get<Actualite>(endpoints.newsBySlug(slug), undefined, signal);
  },

  search(query: string, page = 1, limit = 10, signal?: AbortSignal): Promise<PaginatedResult<Actualite>> {
    return apiClient.getList<Actualite>(endpoints.newsSearch, { q: query, page, limit }, signal);
  },

  async findRecent(limit = 3, signal?: AbortSignal): Promise<Actualite[]> {
    const result = await actualiteService.findAll(1, limit, signal);
    return result.data;
  },
};

export default actualiteService;
