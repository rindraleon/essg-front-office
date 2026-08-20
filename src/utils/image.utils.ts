/**
 * Construit une URL d'image complète à partir d'une référence backend.
 * - /media/...  → proxy MinIO du backend
 * - /uploads/... → anciennes références (legacy)
 * - /images/... → assets statiques du site
 * - http(s)://  → URL déjà absolue
 */

function resolveApiBase(): string {
  const raw =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
    (import.meta.env.VITE_APP_URL as string | undefined) ||
    'http://localhost:3000';
  return raw.replace(/\/$/, '').replace(/\/api$/, '');
}

export const isRemoteImage = (imagePath?: string | null): boolean => {
  if (!imagePath) return false;
  return (
    imagePath.startsWith('http') ||
    imagePath.startsWith('/media/') ||
    imagePath.startsWith('/uploads/') ||
    imagePath.startsWith('/images/')
  );
};

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = resolveApiBase();
  return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

export const getDefaultFormationImage = (slug: string): string => {
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
