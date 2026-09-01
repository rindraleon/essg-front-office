import useScrollAnimation from './useScrollAnimation';

export default function useGsapReveal<T extends HTMLElement>(options?: {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}) {
  return useScrollAnimation<T>({ start: options?.start });
}
