import { apiClient , endpoints } from '@/api';
import type { PaginatedResult } from '@/api';
import type { ProjetItem } from '@/types';
import { generateSlug } from '@/utils';

type ApiProjet = Omit<ProjetItem, 'id' | 'annee' | 'location' | 'partenaires'> & {
  id: number | string;
  date?: string;
  latitude?: number | string;
  longitude?: number | string;
  ville?: string;
  pays?: string;
  adresse?: string;
  partenaires?: Array<string | { nom: string }>;
};

const transformProjet = (projet: ApiProjet): ProjetItem => ({
  id: String(projet.id),
  titre: projet.titre,
  slug: projet.slug || generateSlug(projet.titre),
  type: projet.type,
  statut: projet.statut || 'En cours',
  annee: new Date(projet.date ?? '').getFullYear().toString(),
  description: projet.description,
  partenaires:
    projet.partenaires?.map((partenaire) =>
      typeof partenaire === 'string' ? partenaire : partenaire.nom
    ) || [],
  image: projet.image,
  budget: projet.budget,
  objectifs: projet.objectifs,
  sources: projet.sources ?? [],
  galerie: projet.galerie ?? [],
  location:
    projet.latitude && projet.longitude
      ? {
          lat: Number.parseFloat(String(projet.latitude)),
          lng: Number.parseFloat(String(projet.longitude)),
          ville: projet.ville || '',
          pays: projet.pays || '',
          adresse: projet.adresse,
        }
      : undefined,
});

const projetService = {
  async findPaginated(
    page = 1,
    limit = 6,
    query = '',
    type = '',
    statut = '',
    signal?: AbortSignal
  ): Promise<PaginatedResult<ProjetItem>> {
    const endpoint = query.trim() ? endpoints.projectSearch : endpoints.projects;
    const result = await apiClient.getList<ApiProjet>(
      endpoint,
      {
        page,
        limit,
        q: query.trim() || undefined,
        type: type && type !== 'all' ? type : undefined,
        statut: statut && statut !== 'all' ? statut : undefined,
        sortBy: 'creeLe',
        sortOrder: 'DESC',
      },
      signal
    );
    return {
      data: result.data.map(transformProjet),
      meta: result.meta,
      message: result.message,
      statusCode: result.statusCode,
    };
  },

  async findAll(signal?: AbortSignal): Promise<ProjetItem[]> {
    const result = await apiClient.getList<ApiProjet>(
      endpoints.projects,
      { page: 1, limit: 100, sortBy: 'date', sortOrder: 'DESC' },
      signal
    );
    return result.data.map(transformProjet);
  },

  async findOne(id: number, signal?: AbortSignal): Promise<ProjetItem> {
    const projet = await apiClient.get<ApiProjet>(endpoints.projectById(id), undefined, signal);
    return transformProjet(projet);
  },

  async findBySlug(slug: string, signal?: AbortSignal): Promise<ProjetItem> {
    const projet = await apiClient.get<ApiProjet>(endpoints.projectBySlug(slug), undefined, signal);
    return transformProjet(projet);
  },

  async search(query: string, signal?: AbortSignal): Promise<ProjetItem[]> {
    const result = await apiClient.getList<ApiProjet>(
      endpoints.projectSearch,
      { q: query, page: 1, limit: 50 },
      signal
    );
    return result.data.map(transformProjet);
  },
};

export default projetService;
