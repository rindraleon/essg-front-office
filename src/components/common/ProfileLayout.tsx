import React from 'react';

import { cn } from '@/lib';

import RevealOnScroll from './RevealOnScroll';

interface ProfileSectionProps {
  title: string;
  icon?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

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
      'relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8',
      'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-brand-600 before:via-brand-400 before:to-transparent',
      className
    )}
  >
    <div className="mb-4 flex items-center gap-2.5">
      {icon && <span className="text-brand-600">{icon}</span>}
      <h2 className="text-h4 text-ink-950">{title}</h2>
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
  href?: string;
  external?: boolean;
}

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
        'flex h-full items-start gap-3 rounded-2xl border border-ink-100 bg-ink-50/60 p-4',
        'transition-[transform,background-color,border-color,box-shadow] duration-(--duration-hover) motion-reduce:transition-none',
        href &&
          'hover:border-brand-200 hover:bg-brand-50/60 hover:shadow-card motion-reduce:transform-none'
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
      className="block rounded-xl no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      aria-label={`${label} : ${typeof value === 'string' ? value : ''}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
};

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

export const CheckList: React.FC<{ items?: string[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-body text-ink-600">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
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

          {entry.subtitle && <p className="mt-0.5 text-small text-ink-600">{entry.subtitle}</p>}

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
