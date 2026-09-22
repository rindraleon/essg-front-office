import type { CSSProperties } from 'react';

export const HOVER_CARD =
  'transition-[box-shadow,border-color] duration-(--duration-hover) ease-out ' +
  'focus-within:scale-[1.01] ' +
  'motion-reduce:transition-none motion-reduce:focus-within:scale-100';

export const HOVER_IMAGE_ZOOM =
  'transition-transform duration-(--duration-reveal) ease-out group-hover:scale-[1.03] ' +
  'group-focus-within:scale-[1.04] ' +
  'motion-reduce:transition-none motion-reduce:group-hover:scale-100';

export const MEDIA_CARD_BORDER_STYLE = {
  border: '3px solid transparent',
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
  backgroundImage:
    'linear-gradient(#ffffff, #ffffff), conic-gradient(from var(--rotation, 0deg), var(--color-brand-400) 0deg, var(--color-brand-400) 90deg, var(--color-ink-100) 90deg, var(--color-ink-100) 360deg)',
} as CSSProperties;
