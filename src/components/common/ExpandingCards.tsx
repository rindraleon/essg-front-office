import { Maximize2 } from 'lucide-react';
import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

import { cn } from '@/lib';

export interface ExpandingCardItem {
  id?: string;
  image: string;
  alt: string;
  label?: string;
}

interface ExpandingCardsProps {
  items: ExpandingCardItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveChange?: (index: number) => void;
  onExpand?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
  expandLabel?: string;
}

const ACTIVE_GROW = 5;

const ExpandingCards = ({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveChange,
  onExpand,
  className,
  ariaLabel = 'Galerie',
  expandLabel = 'Agrandir',
}: ExpandingCardsProps) => {
  const count = items.length;
  const isControlled = activeIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(() =>
    Math.min(Math.max(defaultActiveIndex, 0), Math.max(count - 1, 0))
  );
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = Math.min(isControlled ? activeIndex : internalIndex, Math.max(count - 1, 0));

  const select = useCallback(
    (index: number) => {
      if (count === 0) return;
      const next = (index + count) % count;
      if (!isControlled) setInternalIndex(next);
      onActiveChange?.(next);
      buttonsRef.current[next]?.focus({ preventScroll: true });
    },
    [count, isControlled, onActiveChange]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      select(selected + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      select(selected - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      select(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      select(count - 1);
    }
  };

  if (count === 0) return null;

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        // Le ratio est porté par la rangée, pas par les images : sans cela la
        // hauteur dépendait du format intrinsèque de la photo et le passage
        // d'une carte à l'autre (`flex-grow`) déplaçait tout le contenu en
        // dessous. Hauteur désormais déterministe à chaque largeur.
        'flex aspect-[4/3] snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:aspect-[16/9] lg:overflow-visible lg:pb-0',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {items.map((item, index) => {
        const isActive = index === selected;
        const style = { '--card-grow': isActive ? ACTIVE_GROW : 1 } as CSSProperties;

        return (
          <div
            key={item.id ?? `${item.image}-${index}`}
            role="listitem"
            data-gsap
            style={style}
            className={cn(
              'group relative min-w-0 shrink-0 basis-[72%] snap-start overflow-hidden rounded-2xl border bg-ink-50',
              'transition-[flex-grow,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'motion-reduce:transition-none',
              'lg:basis-0 lg:[flex-grow:var(--card-grow)]',
              isActive
                ? 'border-brand-200 shadow-card-hover'
                : 'border-ink-100 shadow-card hover:border-brand-200'
            )}
          >
            <button
              ref={(node) => {
                buttonsRef.current[index] = node;
              }}
              type="button"
              tabIndex={isActive ? 0 : -1}
              aria-current={isActive}
              aria-label={item.alt}
              onClick={() => select(index)}
              className="block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400"
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="size-full object-cover"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-ink-950/70 to-transparent p-3 text-left">
                <span className="text-caption font-semibold text-white">
                  {item.label ?? `${index + 1} / ${count}`}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                select(index);
                onExpand?.(index);
              }}
              aria-label={`${expandLabel} — ${item.alt}`}
              className={cn(
                'absolute right-3 top-3 flex size-9 items-center justify-center rounded-full',
                'bg-white/90 text-ink-900 shadow-card backdrop-blur-sm',
                'transition-[opacity,transform,background-color] duration-(--duration-hover) ease-out',
                'hover:bg-white active:scale-95 motion-reduce:transform-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                isActive
                  ? 'opacity-100'
                  : 'pointer-events-none scale-90 opacity-0 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100'
              )}
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ExpandingCards;
