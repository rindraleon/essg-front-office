import { apiClient, endpoints } from '@/api';
import type { PaginatedResult } from '@/api';
import type { Actualite } from '@/types';

const actualiteService = {
  findAll(
    page = 1,
    limit = 6,
    query = '',
    categorie = '',
    signal?: AbortSignal
  ): Promise<PaginatedResult<Actualite>> {
    const endpoint = query.trim() ? endpoints.newsSearch : endpoints.news;
    return apiClient.getList<Actualite>(
      endpoint,
      {
        page,
        limit,
        q: query.trim() || undefined,
        categorie: categorie && categorie !== 'all' ? categorie : undefined,
        sortBy: 'date',
        sortOrder: 'DESC',
      },
      signal
    );
  },

  findOne(id: number, signal?: AbortSignal): Promise<Actualite> {
    return apiClient.get<Actualite>(endpoints.newsById(id), undefined, signal);
  },

  findBySlug(slug: string, signal?: AbortSignal): Promise<Actualite> {
    return apiClient.get<Actualite>(endpoints.newsBySlug(slug), undefined, signal);
  },

  search(
    query: string,
    page = 1,
    limit = 10,
    signal?: AbortSignal
  ): Promise<PaginatedResult<Actualite>> {
    return apiClient.getList<Actualite>(endpoints.newsSearch, { q: query, page, limit }, signal);
  },

  async findRecent(limit = 3, signal?: AbortSignal): Promise<Actualite[]> {
    const result = await actualiteService.findAll(1, limit, '', '', signal);
    return result.data;
  },
};

export default actualiteService;
