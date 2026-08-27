import React from 'react';

import { Sparkles } from 'lucide-react';

import { cn } from '@/lib';
import Eyebrow from './Eyebrow';

import { RevealOnScroll } from './RevealOnScroll';

export interface SectionHeaderProps {
  title: string;
  /** Accepte du texte enrichi (mises en valeur, liens) et pas seulement une chaîne. */
  description?: React.ReactNode;
  eyebrow?: string;
  dark?: boolean;
  /**
   * Composition de l'en-tête :
   *  - `split`  : surtitre à gauche, titre aligné à droite (sections pleine largeur) ;
   *  - `left`   : tout aligné à gauche (colonne étroite d'une mise en page en deux volets) ;
   *  - `center` : tout centré (bandeaux d'appel à l'action).
   */
  align?: 'split' | 'left' | 'center';
  /** `lg` réserve un titre plus imposant aux bandeaux de conversion. */
  size?: 'md' | 'lg';
  /** Masque l'icône du surtitre lorsque la section en porte déjà une. */
  eyebrowIcon?: React.ReactNode | false;
  className?: string;
}

/**
 * En-tête de section — composant unique de toutes les sections du site.
 *
 * Il garantit qu'un surtitre, un titre, un filet d'accent et un chapô
 * conservent partout la même échelle, le même rythme et les mêmes
 * couleurs, quelle que soit la composition de la section qui l'accueille.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  eyebrow,
  dark = false,
  align = 'split',
  size = 'md',
  eyebrowIcon,
  className,
}) => {
  const isSplit = align === 'split';
  const isCenter = align === 'center';
  const icon = eyebrowIcon === false ? undefined : (eyebrowIcon ?? <Sparkles />);

  return (
    <RevealOnScroll
      variant="fade-up"
      className={cn('mb-12 flex w-full flex-col sm:mb-16', className)}
    >
      <div className="w-full">
        <div
          className={cn(
            'flex w-full flex-col gap-4',
            isSplit && 'sm:flex-row sm:items-center sm:justify-between',
            isCenter && 'items-center'
          )}
        >
          {eyebrow && (
            <Eyebrow variant="pill" dark={dark} icon={icon}>
              {eyebrow}
            </Eyebrow>
          )}

          <div
            className={cn(
              'group relative',
              isSplit && 'text-left sm:text-right',
              isCenter && 'text-center',
              align === 'left' && 'text-left'
            )}
          >
            <h2
              className={cn(
                'text-balance font-display font-bold tracking-tight',
                size === 'lg' ? 'text-h1' : 'text-h2',
                dark ? 'text-white' : 'text-ink-900'
              )}
            >
              {title}
            </h2>

            {/* Filet d'accent : rappel discret du vert du logo, aligné sur
                le bord du titre selon la composition retenue. */}
            <div
              className={cn(
                'mt-3 h-1 w-16 rounded-full bg-brand-500 transition-all duration-500 group-hover:w-28',
                dark && 'bg-brand-400',
                isSplit && 'sm:ml-auto',
                isCenter && 'mx-auto'
              )}
            />
          </div>
        </div>

        {description && (
          <div
            className={cn(
              'mt-4 max-w-2xl text-body-lg leading-relaxed',
              isCenter && 'mx-auto text-center',
              !isCenter && 'text-justify',
              dark ? 'text-white/80' : 'text-ink-600'
            )}
          >
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        )}
      </div>
    </RevealOnScroll>
  );
};

export default SectionHeader;
