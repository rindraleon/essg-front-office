export const HOVER_CARD =
  'transition-[transform,box-shadow,border-color] duration-(--duration-hover) ease-out ' +
  'focus-within:-translate-y-1 focus-within:scale-[1.01] ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100';

export const HOVER_IMAGE_ZOOM =
  'transition-transform duration-(--duration-reveal) ease-out group-hover:scale-[1.03] ' +
  'group-focus-within:scale-[1.04] ' +
  'motion-reduce:transition-none motion-reduce:group-hover:scale-100';
