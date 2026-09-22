import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties, FC, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib';
import { MEDIA_CARD_BORDER_STYLE } from '@/constants';

export interface MediaCardMeta {
  icon?: ReactNode;
  label: string;
}

interface MediaCardProps {
  to: string;
  title: string;
  imageUrl: string;
  imageAlt?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  meta?: MediaCardMeta[];
  actionLabel?: string;
  layout?: 'default' | 'home';
  imageFit?: 'cover' | 'contain';
  className?: string;
}

/* Trame diagonale subtile de la zone contenu, teintée brand-600. */
const PATTERN_TINT = 'color-mix(in srgb, var(--color-brand-600) 6%, transparent)';
const CONTENT_PATTERN_STYLE: CSSProperties = {
  backgroundImage:
    `linear-gradient(45deg, ${PATTERN_TINT} 25%, transparent 25%, transparent 75%, ${PATTERN_TINT} 75%),` +
    `linear-gradient(-45deg, ${PATTERN_TINT} 25%, transparent 25%, transparent 75%, ${PATTERN_TINT} 75%)`,
  backgroundSize: '20px 20px',
};

const normalize = (value?: string): string =>
  (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const dedupeMeta = (
  meta: MediaCardMeta[],
  ...alreadyShown: (string | undefined)[]
): MediaCardMeta[] => {
  const seen = new Set(alreadyShown.map(normalize).filter(Boolean));
  return meta.filter((item) => {
    const key = normalize(item.label);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

function CardBadges({ badge, subtitle }: Readonly<{ badge?: string; subtitle?: string }>) {
  if (!badge && !subtitle) return null;
  const pillClass =
    'pointer-events-none inline-flex max-w-[calc(100%-2rem)] items-center rounded-full border border-ink-950/10 bg-white/90 px-3 py-1 text-caption font-semibold text-brand-800 shadow-xs backdrop-blur-sm';
  return (
    <>
      {badge && (
        <span className={cn(pillClass, 'absolute right-4 top-4 z-10')}>
          <span className="truncate">{badge}</span>
        </span>
      )}
      {subtitle && (
        <span className={cn(pillClass, 'absolute bottom-4 left-4 z-10')}>
          <span className="truncate">{subtitle}</span>
        </span>
      )}
    </>
  );
}

/* Métadonnées dans le contenu, rendues uniquement si présentes. */
function CardMeta({ items }: Readonly<{ items: MediaCardMeta[] }>) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex min-w-0 max-w-full items-center gap-1.5 text-caption font-medium text-ink-500"
        >
          {item.icon && (
            <span aria-hidden="true" className="shrink-0 text-brand-600">
              {item.icon}
            </span>
          )}
          <span className="truncate">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

const MediaCard: FC<MediaCardProps> = ({
  to,
  title,
  imageUrl,
  imageAlt,
  badge,
  subtitle,
  description,
  meta = [],
  actionLabel = 'Voir le détail',
  layout = 'default',
  imageFit = 'cover',
  className,
}) => {
  const visibleMeta = dedupeMeta(meta, title, badge, subtitle);
  const borderRef = useRef<HTMLElement | null>(null);
  const contentPadding = layout === 'home' ? 'p-5' : 'p-5 sm:p-6';

  const handleMouseMove = (e: ReactMouseEvent<HTMLElement>): void => {
    const border = borderRef.current;
    if (!border) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = border.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    border.style.setProperty('--rotation', `${Math.atan2(y, x)}rad`);
  };

  const handleMouseLeave = (): void => {
    borderRef.current?.style.setProperty('--rotation', '0deg');
  };

  return (
    <article
      data-gsap
      ref={borderRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={MEDIA_CARD_BORDER_STYLE}
      className={cn(
        'media-card relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card',
        className
      )}
    >
      {/* Image cliquable — format 16/9 pour toutes les cartes. */}
      <div
        className={cn(
          'relative aspect-video shrink-0 overflow-hidden',
          imageFit === 'contain' ? 'bg-white' : 'bg-ink-900'
        )}
      >
        <Link
          to={to}
          className="group/image block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400"
        >
          <img
            src={imageUrl}
            alt={imageAlt ?? title}
            loading="lazy"
            decoding="async"
            className={cn(
              'size-full transition-transform duration-(--duration-reveal) ease-out group-hover/image:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/image:scale-100',
              imageFit === 'contain' ? 'object-contain p-8' : 'object-cover'
            )}
          />
        </Link>
        <CardBadges badge={badge} subtitle={subtitle} />
      </div>

      {/* Contenu à hauteur automatique : chaque bloc n'existe que si sa donnée existe. */}
      <div className={cn('flex flex-1 flex-col', contentPadding)} style={CONTENT_PATTERN_STYLE}>
        <h3 className="text-h4 font-bold text-ink-900">
          <Link
            to={to}
            className="group/title relative block rounded-md transition-colors duration-(--duration-micro) hover:text-brand-800 motion-reduce:transition-none"
          >
            <span
              aria-hidden="true"
              className="absolute -inset-x-2 -inset-y-1 rounded-md bg-brand-200 transition-[clip-path] duration-400 ease-[cubic-bezier(0.1,0.5,0.5,1)] [clip-path:polygon(0_50%,100%_50%,100%_50%,0_50%)] group-hover/title:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] motion-reduce:transition-none"
            />
            <span className="relative z-10 line-clamp-2">{title}</span>
          </Link>
        </h3>
        {description && (
          <p className="mt-2 line-clamp-3 text-justify text-small leading-relaxed text-ink-600">
            {description}
          </p>
        )}
        <CardMeta items={visibleMeta} />
        <div className="mt-4 justify-self-end self-end">
          <Link
            to={to}
            aria-label={`${actionLabel} — ${title}`}
            className="group/action inline-flex items-center gap-1.5 text-small font-semibold text-brand-700 transition-colors duration-(--duration-micro) hover:text-brand-800 motion-reduce:transition-none"
          >
            {actionLabel}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-out group-hover/action:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default MediaCard;
