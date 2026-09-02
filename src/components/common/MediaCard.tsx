import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib';
import { HOVER_CARD, HOVER_IMAGE_ZOOM } from '@/constants';

export interface MediaCardMeta {
  icon?: React.ReactNode;
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
  ratio?: 'portrait' | 'landscape';
  layout?: 'default' | 'home';
  imageFit?: 'cover' | 'contain';
  className?: string;
}

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
  layout = 'default',
  imageFit = 'cover',
  className,
}) => {
  const isHomeLayout = layout === 'home';
  const visibleMeta = dedupeMeta(meta, title, badge, subtitle);
  const showSubtitlePill = Boolean(subtitle) && !isHomeLayout;
  const hasDetails = Boolean(description) || visibleMeta.length > 0;
  const surfaceClass = imageFit === 'contain' ? 'bg-white' : 'bg-ink-900';
  const ratioClass = ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/10]';
  const titleLinkClass =
    "after:absolute after:inset-0 after:z-20 after:content-[''] focus-visible:outline-none";

  return (
    <article
      data-gsap
      className={cn(
        'media-card group relative isolate overflow-hidden rounded-2xl shadow-card transition-all duration-300 ease-out hover:border-brand-300 hover:shadow-card-hover focus-within:shadow-card-hover',
        isHomeLayout ? 'flex h-full flex-col border border-ink-100 bg-white' : surfaceClass,
        HOVER_CARD,
        !isHomeLayout && ratioClass,
        className
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          isHomeLayout ? 'aspect-[16/10] shrink-0' : 'absolute inset-0'
        )}
      >
        <img
          src={imageUrl}
          alt={imageAlt ?? title}
          loading="lazy"
          decoding="async"
          className={cn(
            'absolute inset-0 size-full transition-transform duration-500 ease-out group-hover:scale-108',
            HOVER_IMAGE_ZOOM,
            imageFit === 'contain' ? 'object-contain p-8' : 'object-cover'
          )}
        />

        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-ink-950/85 to-transparent',
            imageFit === 'contain' ? 'via-ink-950/10 via-45%' : 'via-ink-950/25'
          )}
        />

        <div
          aria-hidden="true"
          data-card-veil
          className={cn(
            'absolute inset-0 bg-ink-950/45 opacity-0 transition-opacity duration-(--duration-hover) ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none',
            isHomeLayout && 'hidden'
          )}
        />

        {(badge || showSubtitlePill) && (
          <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
            {badge && (
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-caption font-semibold text-brand-800 backdrop-blur-sm shadow-xs transition-transform duration-300 group-hover:scale-105">
                {badge}
              </span>
            )}

            {showSubtitlePill && (
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-caption font-semibold text-brand-800 backdrop-blur-sm shadow-xs">
                {subtitle}
              </span>
            )}
          </div>
        )}

        {isHomeLayout && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex h-[9.25rem] flex-col justify-end bg-gradient-to-t from-ink-950/95 via-ink-950/65 to-transparent p-5 pt-12">
            <h3 className="flex h-[3.75rem] items-end text-h4 font-bold text-white group-hover:text-brand-200 transition-colors">
              <Link
                to={to}
                className={titleLinkClass}
                aria-label={`${title} — ${actionLabel.toLowerCase()}`}
              >
                <span className="line-clamp-2">{title}</span>
              </Link>
            </h3>
            <p className="mt-1 h-5 truncate text-small text-brand-300">{subtitle || '\u00a0'}</p>
            <span className="mt-2 inline-flex h-4 items-center gap-1.5 text-caption font-semibold text-white/85 transition-colors duration-(--duration-micro) group-hover:text-brand-300 group-focus-within:text-brand-300 motion-reduce:transition-none">
              {actionLabel}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </div>
        )}
      </div>

      {isHomeLayout ? (
        <div className="flex min-h-[9.5rem] flex-1 flex-col bg-white p-5">
          <p
            className={cn(
              'line-clamp-3 min-h-[4.5rem] text-justify text-small leading-relaxed text-ink-600',
              !description && 'text-transparent'
            )}
          >
            {description || '\u00a0'}
          </p>

          {visibleMeta.length > 0 ? (
            <ul className="mt-3 flex min-h-[1.75rem] flex-wrap content-start gap-x-4 gap-y-1">
              {visibleMeta.map((item) => (
                <li
                  key={item.label}
                  className="flex min-w-0 items-center gap-1.5 text-caption font-medium text-ink-500"
                >
                  <span className="text-brand-600">{item.icon}</span>
                  <span className="line-clamp-1">{item.label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span aria-hidden="true" className="mt-3 min-h-[1.75rem]" />
          )}
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          {hasDetails && (
            <div
              data-card-details
              className={cn(
                'pointer-events-none absolute inset-x-5 bottom-full mb-3 opacity-0 transition-opacity duration-(--duration-hover) ease-out',
                'group-hover:opacity-100',
                'group-focus-within:opacity-100',
                'motion-reduce:transition-none'
              )}
            >
              {description && (
                <p
                  className={cn(
                    ratio === 'landscape' ? 'line-clamp-2' : 'line-clamp-3',
                    'text-justify text-small leading-relaxed text-white/95'
                  )}
                >
                  {description}
                </p>
              )}

              {visibleMeta.length > 0 && (
                <ul className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1">
                  {visibleMeta.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-1.5 text-caption text-white/85"
                    >
                      {item.icon}
                      <span className="normal-case tracking-normal">{item.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <h3 className="text-h3 font-bold text-white group-hover:text-brand-200 transition-colors">
            <Link
              to={to}
              className={titleLinkClass}
              aria-label={`${title} — ${actionLabel.toLowerCase()}`}
            >
              <span className="line-clamp-2">{title}</span>
            </Link>
          </h3>

          <span className="mt-2 inline-flex items-center gap-1.5 text-caption font-semibold uppercase text-white/85 transition-colors duration-(--duration-micro) group-hover:text-brand-300 group-focus-within:text-brand-300 motion-reduce:transition-none">
            {actionLabel}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </div>
      )}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 rounded-2xl ring-2 ring-brand-400 opacity-0 group-focus-within:opacity-100"
      />
    </article>
  );
};

export default MediaCard;
