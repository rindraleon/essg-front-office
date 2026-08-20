import { Filter, X } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface FilterGroup {
  /** Identifiant technique du groupe (ex. « niveau »). */
  key: string;
  /** Intitulé affiché au-dessus des options. */
  label: string;
  /** Valeur retenue. `all` correspond à « aucun filtre ». */
  value: string;
  options: { value: string; label: string }[];
}

interface FilterButtonProps {
  groups: FilterGroup[];
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  /**
   * Sur desktop, le bouton n'apparaît qu'au survol du groupe de contrôles
   * (§3). Le parent doit porter la classe `group` et passer `revealOnHover`.
   * Le bouton reste toujours visible sur tactile, au clavier et dès qu'un
   * filtre est actif — le survol n'est jamais l'unique moyen d'accès.
   */
  revealOnHover?: boolean;
  className?: string;
}

/**
 * Contrôle de filtrage partagé par les sections Formations, Actualités et
 * Projets (§7).
 *
 * Un seul composant plutôt qu'un par section : cela garantit que le bouton,
 * le panneau, l'animation, le comportement clavier et le rendu mobile sont
 * strictement identiques partout.
 *
 * Le panneau est un popover positionné, et non un menu natif : les options
 * sont présentées en pastilles, plus lisibles et plus faciles à toucher
 * qu'une liste déroulante (§19).
 */
const FilterButton: React.FC<FilterButtonProps> = ({
  groups,
  onChange,
  onReset,
  revealOnHover = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const activeCount = groups.filter((group) => group.value !== 'all').length;
  const hasActive = activeCount > 0;

  /** Libellé accessible : il annonce le nombre de filtres réellement posés. */
  const plural = activeCount > 1 ? 's' : '';
  const triggerLabel = hasActive
    ? `Filtrer — ${activeCount} filtre${plural} actif${plural}`
    : 'Filtrer';

  // Fermeture au clic extérieur.
  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Fermeture à la touche Échap, avec retour du focus sur le bouton :
  // sans cela, le focus retomberait en début de document.
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={triggerLabel}
        className={cn(
          // Même gabarit que les flèches de navigation (§21) : hauteur 40 px,
          // même rayon, même bordure, même transition.
          'inline-flex h-10 items-center gap-2 rounded-full border px-4',
          'text-small font-medium shadow-card',
          'transition-[background-color,border-color,color,opacity,transform]',
          'duration-[--duration-hover] ease-out motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          hasActive || open
            ? 'border-brand-200 bg-brand-50 text-brand-700'
            : 'border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700',
          /*
            Apparition au survol (§3) — desktop uniquement.
            `opacity` + `translate-x` : ni l'un ni l'autre ne modifie la mise
            en page, le bouton occupe donc sa place en permanence et les
            flèches voisines ne se déplacent pas quand il apparaît.
            `focus-within` et `hasActive` le rendent visible sans survol.
          */
          revealOnHover &&
            !hasActive &&
            !open && [
              'lg:translate-x-2 lg:opacity-0',
              'lg:group-hover:translate-x-0 lg:group-hover:opacity-100',
              'lg:focus-visible:translate-x-0 lg:focus-visible:opacity-100',
              'lg:group-focus-within:translate-x-0 lg:group-focus-within:opacity-100',
              // Écrans tactiles : aucun survol possible, toujours visible.
              '[@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100',
            ],
        )}
      >
        <Filter className="size-4" />
        <span>Filtrer</span>
        {hasActive && (
          <span
            data-numeric
            className="inline-flex size-5 items-center justify-center rounded-full bg-brand-600 text-caption font-semibold text-white"
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id={panelId}
          className={cn(
            'absolute right-0 top-12 z-40 w-[min(20rem,calc(100vw-2rem))]',
            'rounded-2xl border border-ink-100 bg-white p-4 shadow-elevated',
            'origin-top-right animate-scale-in',
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-h6 text-ink-900">Filtrer</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer les filtres"
              className="grid size-7 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900 motion-reduce:transition-none"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-4">
            {groups.map((group) => (
              <fieldset key={group.key} className="border-0 p-0">
                <legend className="mb-2 text-caption font-semibold uppercase text-ink-500">
                  {group.label}
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((option) => {
                    const selected = group.value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        // `aria-pressed` plutôt que `aria-selected` : ce sont
                        // des bascules, pas des options d'une liste unique.
                        aria-pressed={selected}
                        onClick={() => onChange(group.key, option.value)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-small transition-colors',
                          'duration-[--duration-micro] ease-out motion-reduce:transition-none',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
                          selected
                            ? 'border-brand-600 bg-brand-600 font-medium text-white'
                            : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50',
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {hasActive && (
            <button
              type="button"
              onClick={() => {
                onReset();
                setOpen(false);
              }}
              className="mt-4 w-full rounded-xl border border-ink-200 py-2 text-small font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none"
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterButton;
