import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HOVER_CARD, HOVER_IMAGE_ZOOM } from '../../constants/motion';

export interface MediaCardMeta {
  /** Icône facultative rendue avant le texte (taille attendue : `size-3.5`). */
  icon?: React.ReactNode;
  label: string;
}

interface MediaCardProps {
  /** Destination : la carte entière est cliquable. */
  to: string;
  /** Titre affiché en permanence, en bas de l'image. */
  title: string;
  imageUrl: string;
  /** Texte alternatif ; par défaut le titre. */
  imageAlt?: string;
  /** Étiquette d'angle (niveau, catégorie, type…). */
  badge?: string;
  /** Sous-titre discret sous le titre (poste, secteur, mention…). */
  subtitle?: string;
  /** Texte révélé au survol. Tronqué à trois lignes. */
  description?: string;
  /** Métadonnées révélées au survol (date, lieu, durée…). */
  meta?: MediaCardMeta[];
  /** Libellé de l'action, révélé au survol. */
  actionLabel?: string;
  /** Proportion de la vignette. */
  ratio?: 'portrait' | 'landscape';
  /**
   * Ajustement de l'image. `cover` (défaut) recadre pour remplir le cadre ;
   * `contain` affiche l'image entière sur un fond clair — indispensable pour
   * les logos, qu'un recadrage rendrait illisibles.
   */
  imageFit?: 'cover' | 'contain';
  className?: string;
}

/**
 * Carte média du frontend — présentation unique pour Formations, Actualités,
 * Projets, Partenaires et Ressources humaines (§2.2).
 *
 * État normal : l'image et le titre, posé sur un dégradé qui garantit le
 * contraste quelle que soit la photo.
 *
 * État survol / focus : les informations complémentaires apparaissent
 * au-dessus du titre. Elles sont positionnées hors flux (`bottom-full`) :
 * le titre ne bouge donc jamais, et l'animation ne touche que `opacity` et
 * `transform` — aucun reflow, aucun saut de hauteur.
 *
 * Tactile : le survol n'existe pas, la règle `@media (hover: none)` de
 * `styles/index.css` révèle donc les informations en permanence ; la carte
 * reste entièrement cliquable, ce qui suffit à atteindre le détail.
 *
 * Clavier : `focus-within` déclenche la même révélation que le survol, et le
 * lien couvre toute la carte (cible tactile largement supérieure à 44 px).
 */
const MediaCard: React.FC<MediaCardProps> = ({
  to,
  title,
  imageUrl,
  imageAlt,
  badge,
  subtitle,
  description,
  meta = [],
  actionLabel = 'Voir le détail',
  ratio = 'portrait',
  imageFit = 'cover',
  className,
}) => {
  const hasDetails = Boolean(description) || meta.length > 0;

  return (
    <article
      data-gsap
      className={cn(
        'media-card group relative isolate overflow-hidden rounded-2xl shadow-card',
        imageFit === 'contain' ? 'bg-white' : 'bg-ink-900',
        // Survol partagé (§7.5) : soulèvement + agrandissement minime.
        HOVER_CARD,
        'hover:shadow-card-hover focus-within:shadow-card-hover',
        ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[4/3]',
        className,
      )}
    >
      <img
        src={imageUrl}
        alt={imageAlt ?? title}
        loading="lazy"
        className={cn(
          'absolute inset-0 size-full',
          // Zoom de vignette (§7.6) : 1.03 suffit à suggérer la profondeur.
          // Au-delà, le sujet de la photo se recadre visiblement.
          HOVER_IMAGE_ZOOM,
          imageFit === 'contain' ? 'object-contain p-8' : 'object-cover',
        )}
      />

      {/* Voile permanent : garantit la lisibilité du titre sur toute image. */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-ink-950/85 to-transparent',
          // Sur un logo (fond blanc), le dégradé ne couvre que le bas :
          // l'image reste entièrement visible, le titre reste lisible.
          imageFit === 'contain' ? 'via-ink-950/10 via-45%' : 'via-ink-950/25',
        )}
      />

      {/* Voile de survol : renforce le contraste des informations révélées. */}
      <div
        aria-hidden="true"
        data-card-veil
        className="absolute inset-0 bg-ink-950/45 opacity-0 transition-opacity duration-[--duration-hover] ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
      />

      {badge && (
        <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-caption font-semibold uppercase text-brand-800 backdrop-blur-sm">
          {badge}
        </span>
      )}

      {/* Bloc titre : ancré en bas, il ne se déplace jamais. */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        {hasDetails && (
          <div
            data-card-details
            className={cn(
              'pointer-events-none absolute inset-x-5 bottom-full mb-3',
              'translate-y-3 opacity-0 transition-[opacity,transform] duration-[--duration-hover] ease-out',
              'group-hover:translate-y-0 group-hover:opacity-100',
              'group-focus-within:translate-y-0 group-focus-within:opacity-100',
              'motion-reduce:transition-none',
            )}
          >
            {description && (
              <p className="line-clamp-3 text-small leading-relaxed text-white/90">{description}</p>
            )}

            {meta.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {meta.map((item) => (
                  <li key={item.label} className="flex items-center gap-1.5 text-caption text-white/75">
                    {item.icon}
                    <span className="normal-case tracking-normal">{item.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <h3 className="text-h4 text-white">
          {/* Lien étendu : toute la carte est cliquable, sans imbriquer
              d'éléments interactifs les uns dans les autres. */}
          <Link
            to={to}
            className="after:absolute after:inset-0 after:z-20 after:content-[''] focus-visible:outline-none"
            aria-label={`${title} — ${actionLabel.toLowerCase()}`}
          >
            <span className="line-clamp-2">{title}</span>
          </Link>
        </h3>

        {subtitle && <p className="mt-1 line-clamp-1 text-small text-sage-300">{subtitle}</p>}

        <span className="mt-2 inline-flex items-center gap-1.5 text-caption font-semibold uppercase text-white/85 transition-colors duration-[--duration-micro] group-hover:text-sage-300 group-focus-within:text-sage-300 motion-reduce:transition-none">
          {actionLabel}
          {/* Glissement de 3 px au survol (§7.5) : le mouvement prolonge la
              direction de la flèche, il se lit comme « on y va ». */}
          <ArrowUpRight className="size-3.5 transition-transform duration-[--duration-micro] ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-focus-within:translate-x-[3px] group-focus-within:-translate-y-[3px] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
        </span>
      </div>

      {/* Anneau de focus visible : le lien étendu masque le sien. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 rounded-2xl ring-2 ring-sage-400 opacity-0 group-focus-within:opacity-100"
      />
    </article>
  );
};

export default MediaCard;
