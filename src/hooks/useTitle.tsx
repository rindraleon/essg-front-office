import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applySeoMeta, type SeoMeta } from '@/utils/seo.utils';

/**
 * Hook SEO central : applique titre, description, Open Graph, URL canonique
 * et JSON-LD de la page courante. Sans métadonnées explicites, les valeurs
 * proviennent de la table PAGE_SEO (route correspondante).
 */
export const useSeo = (meta: SeoMeta = {}) => {
  const location = useLocation();
  // Clé de dépendance stable basée sur le contenu réel des métadonnées.
  const metaKey = JSON.stringify(meta);

  useEffect(() => {
    const parsed = metaKey ? (JSON.parse(metaKey) as SeoMeta) : {};
    applySeoMeta({ ...parsed, path: location.pathname });
  }, [metaKey, location.pathname]);
};

/** API historique : `useTitle` pilote désormais l'ensemble des métadonnées. */
export const useTitle = (title?: string) => {
  useSeo(title ? { title } : {});

  const setTitle = useCallback((newTitle: string) => {
    applySeoMeta({ title: newTitle });
  }, []);

  return { setTitle };
};

export default useTitle;
