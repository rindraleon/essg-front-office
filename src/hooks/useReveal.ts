import useGsapReveal from './useGsapReveal';

export interface RevealOptions {
  start?: string;
}

const DEFAULT_START = 'top 88%';

export default function useReveal<T extends HTMLElement>(options?: RevealOptions) {
  return useGsapReveal<T>({ start: options?.start ?? DEFAULT_START });
}
