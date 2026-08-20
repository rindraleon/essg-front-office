import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface DetailPageSkeletonProps {
  /**
   * Message annoncé aux lecteurs d'écran. Le squelette est décoratif ; sans
   * ce texte, une personne non voyante n'aurait aucune indication que la
   * page est en cours de chargement.
   */
  label?: string;
  /**
   * `article` : un grand visuel puis une colonne de texte (actualité).
   * `split`   : un bandeau puis deux colonnes (formation, projet).
   */
  layout?: 'article' | 'split';
}

/**
 * Silhouette d'une page de détail pendant le chargement (§7.13).
 *
 * Remplace le spinner centré qui occupait ces pages : un spinner indique
 * qu'il se passe quelque chose, mais ne dit rien de ce qui va arriver.
 * Le squelette reprend le gabarit réel de la page, donc l'utilisateur en
 * comprend la structure avant même que les données arrivent — et le contenu
 * final s'y substitue sans décalage de mise en page.
 */
const DetailPageSkeleton: React.FC<DetailPageSkeletonProps> = ({
  label = 'Chargement…',
  layout = 'article',
}) => (
  <div className="min-h-screen bg-ink-50">
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Fil d'Ariane */}
        <Skeleton className="h-4 w-64" />

        {/* Visuel principal */}
        <Skeleton className="h-72 rounded-3xl sm:h-80" />

        {layout === 'article' ? (
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-9 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        )}
      </div>

      {/* `role="status"` : le changement est annoncé sans voler le focus. */}
      <p role="status" className="sr-only">
        {label}
      </p>
    </div>
  </div>
);

export default DetailPageSkeleton;
