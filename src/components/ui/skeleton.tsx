import { cn } from '@/lib/utils';

/**
 * Silhouette de contenu en cours de chargement (§7.13).
 *
 * Le balayage (`skeleton-shimmer`, défini dans `styles/index.css`) remplace
 * l'ancienne pulsation d'opacité : il indique un sens de progression, là où
 * une pulsation se contente de signaler « quelque chose se passe ».
 * L'animation porte sur `background-position`, qui ne provoque ni recalcul
 * de mise en page ni redécoupage — seule la peinture est refaite.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer rounded-md bg-ink-100', className)}
      {...props}
    />
  );
}

export { Skeleton };
