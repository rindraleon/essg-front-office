import React from 'react';
import { cn } from '@/lib/utils';
import RevealOnScroll from './RevealOnScroll';

/* ═══════════════════════════════════════════════════════════════════════
   Langage visuel commun aux pages de détail « profil ».

   Partagé par Ressource humaine et Partenaire : les deux pages doivent
   donner le sentiment d'appartenir au même système, avec les mêmes
   espacements, la même hiérarchie et les mêmes animations.
   ═══════════════════════════════════════════════════════════════════════ */

interface ProfileSectionProps {
  title: string;
  icon?: React.ReactNode;
  /** Compteur affiché à droite du titre. */
  count?: number;
  children: React.ReactNode;
  /** Délai d'apparition, pour échelonner les sections d'une même page. */
  delay?: number;
  className?: string;
}

/** Bloc de contenu titré, révélé au défilement. */
export const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  count,
  children,
  delay = 0,
  className,
}) => (
  <RevealOnScroll
    as="section"
    delay={delay}
    className={cn(
      'rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-7',
      className,
    )}
  >
    <div className="mb-4 flex items-center gap-2.5">
      {icon && <span className="text-brand-600">{icon}</span>}
      <h2 className="text-h3 text-ink-900">{title}</h2>
      {count !== undefined && count > 0 && (
        <span
          data-numeric
          className="rounded-md bg-brand-50 px-2 py-0.5 text-caption text-brand-700"
        >
          {count}
        </span>
      )}
    </div>
    {children}
  </RevealOnScroll>
);

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  /** Rend la tuile cliquable (mailto:, tel:, lien externe). */
  href?: string;
  /** Ouvre le lien dans un nouvel onglet. */
  external?: boolean;
}

/**
 * Tuile de coordonnée : icône, libellé, valeur.
 *
 * Rendue en `<a>` lorsqu'une action est possible, en `<div>` sinon — plutôt
 * qu'un lien inerte, qui serait annoncé à tort par les lecteurs d'écran.
 */
export const InfoTile: React.FC<InfoTileProps> = ({
  icon,
  label,
  value,
  href,
  external = false,
}) => {
  const content = (
    <div
      className={cn(
        'flex h-full items-start gap-3 rounded-xl border border-ink-100 bg-ink-50/60 p-4',
        'transition-colors duration-200 motion-reduce:transition-none',
        href && 'hover:border-brand-200 hover:bg-brand-50/60',
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-brand-100">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-caption uppercase text-ink-400">{label}</span>
        <span className="mt-0.5 block break-words text-small font-semibold text-ink-900">
          {value}
        </span>
      </span>
    </div>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      className="block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl"
      aria-label={`${label} : ${typeof value === 'string' ? value : ''}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
};

/** Liste d'étiquettes : compétences, langues, domaines. */
export const TagCloud: React.FC<{ items?: string[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-1.5 text-small font-medium text-brand-800"
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

/** Liste à puces pour les intitulés longs (diplômes, formations). */
export const CheckList: React.FC<{ items?: string[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-body text-ink-600">
          <span
            aria-hidden
            className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500"
          />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export interface TimelineEntry {
  title: string;
  subtitle?: string;
  period?: string;
}

/**
 * Frise verticale du parcours professionnel.
 *
 * Le trait continu et les pastilles matérialisent la chronologie : plus
 * lisible qu'une simple liste pour comparer des périodes.
 */
export const Timeline: React.FC<{ entries: TimelineEntry[] }> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <ol className="relative space-y-6 border-l border-ink-100 pl-6">
      {entries.map((entry, index) => (
        <li key={`${entry.title}-${index}`} className="relative">
          <span
            aria-hidden
            className="absolute -left-[1.9375rem] top-1.5 size-3 rounded-full border-2 border-white bg-brand-500 ring-1 ring-brand-200"
          />
          <h3 className="text-h4 text-ink-900">{entry.title}</h3>
          {entry.subtitle && (
            <p className="mt-0.5 text-small text-ink-600">{entry.subtitle}</p>
          )}
          {entry.period && (
            <p data-numeric className="mt-1 text-caption uppercase text-ink-400">
              {entry.period}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
};
