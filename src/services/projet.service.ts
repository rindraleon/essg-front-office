import { apiClient } from '@/api/client/http';
import { endpoints } from '@/api/endpoints';
import type { ProjetItem } from '../types/projets.types';
import { generateSlug } from '../utils/slug.utils';

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
  /*
    Repli sur « En cours » uniquement pour les projets enregistrés avant
    l'ajout de la colonne `statut` en base. Le statut réel provient
    désormais du back-office : ce repli ne doit plus jamais s'appliquer
    aux projets créés ou modifiés depuis.
  */
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
