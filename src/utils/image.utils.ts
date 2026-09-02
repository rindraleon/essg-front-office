function resolveApiBase(): string {
  const raw =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
    (import.meta.env.VITE_APP_URL as string | undefined) ||
    'http://localhost:3000';
  return raw.replace(/\/$/, '').replace(/\/api$/, '');
}

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = resolveApiBase();
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${normalizedPath}`;
};

const getDefaultFormationImage = (slug: string): string => {
  const HERO_IMAGES: Record<string, string> = {};
  const hash = HERO_IMAGES[slug] ?? '1524178232363-1fb2b075b655';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
};

export const getFormationImage = (imagePath: string, slug: string): string => {
  if (imagePath) {
    return getImageUrl(imagePath);
  }
  return getDefaultFormationImage(slug);
};
