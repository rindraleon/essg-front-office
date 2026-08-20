import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  center?: boolean;
  /** Largeur maximale du bloc. Par défaut : largeur de lecture confortable. */
  maxWidth?: string;
}

/**
 * En-tête de section : label facultatif, titre, description (§1).
 *
 * Rythme vertical fixe — label 12 px, titre, description 12 px — pour que
 * toutes les sections du site présentent le même espacement entre ces trois
 * niveaux, quelle que soit la page.
 *
 * La description est bornée à `65ch` plutôt qu'à une largeur en pixels : la
 * limite suit alors la taille réelle des caractères, donc la ligne conserve
 * le même nombre de mots quelle que soit la taille de police choisie par
 * l'utilisateur dans son navigateur (§1 : 60–75 caractères par ligne).
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  eyebrow,
  center = true,
  maxWidth = 'max-w-[65ch]',
}) => {
  return (
    <div
      data-gsap="up"
      className={cn('mb-12 flex flex-col', center ? 'items-center text-center' : 'items-start')}
    >
      <div className={cn(maxWidth, center && 'text-center')}>
        {eyebrow && (
          <span className="mb-3 block text-caption font-semibold uppercase tracking-wider text-brand-700">
            {eyebrow}
          </span>
        )}

        <h2 className="text-h2 text-ink-900">{title}</h2>

        <p className="mt-3 text-body-lg text-ink-500">{description}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
