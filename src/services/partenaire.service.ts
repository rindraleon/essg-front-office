import { apiClient } from '@/api/client/http';
import { endpoints } from '@/api/endpoints';
import type { PartenaireItem } from '../types/partenaire.types';

const partenaireService = {
  async findAll(signal?: AbortSignal): Promise<PartenaireItem[]> {
    const result = await apiClient.getList<PartenaireItem>(
      endpoints.partners,
      { page: 1, limit: 100 },
      signal,
    );
    return result.data;
  },

  async findAllPaginated(page = 1, limit = 100, signal?: AbortSignal): Promise<PartenaireItem[]> {
    const result = await apiClient.getList<PartenaireItem>(
      endpoints.partners,
      { page, limit },
      signal,
    );
    return result.data;
  },

  findOne(id: number, signal?: AbortSignal): Promise<PartenaireItem> {
    return apiClient.get<PartenaireItem>(endpoints.partnerById(id), undefined, signal);
  },

  findBySlug(slug: string, signal?: AbortSignal): Promise<PartenaireItem> {
    return apiClient.get<PartenaireItem>(endpoints.partnerBySlug(slug), undefined, signal);
  },

  async search(query: string, signal?: AbortSignal): Promise<PartenaireItem[]> {
    const result = await apiClient.getList<PartenaireItem>(
      endpoints.partnerSearch,
      { q: query, page: 1, limit: 50 },
      signal,
    );
    return result.data;
  },
};

export default partenaireService;
