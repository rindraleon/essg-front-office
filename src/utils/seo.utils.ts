import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_FULL_NAME,
  SITE_NAME,
  SITE_URL_ORIGIN,
  findPageSeo,
} from '@/constants/seo.constants';

export interface SeoMeta {
  /** Titre complet ; s'il ne contient pas « ESSG », le suffixe est ajouté. */
  title?: string;
  description?: string;
  /** Chemin logique (ex. « /formations/master-sig ») ; défaut : location.pathname. */
  path?: string;
  /** Image de partage, chemin relatif ou absolu. */
  image?: string;
  ogType?: 'website' | 'article';
  /** Bloqué JSON-LD propre à la page (Course, NewsArticle, FAQPage…). */
  pageSchema?: Record<string, unknown> | Record<string, unknown>[] | null;
}

const PAGE_SCHEMA_ID = 'essg-page-schema';
const SITE_SCHEMA_ID = 'essg-site-schema';

/** Origine officielle absolue (env ou défaut configuré) — jamais l'hôte runtime. */
function getOrigin(): string {
  return SITE_URL_ORIGIN;
}

function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${getOrigin()}${path.startsWith('/') ? '' : '/'}${path}`;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Graphe de connaissances du site, injecté une seule fois. */
function ensureSiteSchema(): void {
  if (document.getElementById(SITE_SCHEMA_ID)) return;
  const origin = getOrigin();
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${origin}/#organization`,
        name: SITE_FULL_NAME,
        alternateName: SITE_NAME,
        url: origin,
        logo: toAbsoluteUrl(DEFAULT_OG_IMAGE),
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: SITE_FULL_NAME,
        inLanguage: 'fr',
        publisher: { '@id': `${origin}/#organization` },
      },
    ],
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = SITE_SCHEMA_ID;
  script.textContent = JSON.stringify(graph);
  document.head.appendChild(script);
}

function setPageSchema(schema: SeoMeta['pageSchema']): void {
  const existing = document.getElementById(PAGE_SCHEMA_ID) as HTMLScriptElement | null;
  if (!schema) {
    existing?.remove();
    return;
  }
  const script = existing ?? document.createElement('script');
  script.type = 'application/ld+json';
  script.id = PAGE_SCHEMA_ID;
  script.textContent = JSON.stringify(
    Array.isArray(schema)
      ? { '@context': 'https://schema.org', '@graph': schema }
      : { '@context': 'https://schema.org', ...schema }
  );
  if (!existing) document.head.appendChild(script);
}

/** Applique titre, description, balises Open Graph/Twitter, URL canonique et JSON-LD. */
export function applySeoMeta(meta: SeoMeta = {}): void {
  ensureSiteSchema();

  const pathname = meta.path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const pageDefault = findPageSeo(pathname);

  const rawTitle = meta.title || pageDefault?.title || DEFAULT_TITLE;
  const title = /ESSG/i.test(rawTitle) ? rawTitle : `${rawTitle} | ${SITE_NAME}`;
  const description = (meta.description || pageDefault?.description || DEFAULT_DESCRIPTION).trim();
  const imageUrl = toAbsoluteUrl(meta.image || DEFAULT_OG_IMAGE);
  const url = toAbsoluteUrl(pathname);

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertLink('canonical', url);

  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:type', meta.ogType ?? 'website');
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:image', imageUrl);
  upsertMeta('property', 'og:locale', 'fr_FR');

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', imageUrl);

  setPageSchema(meta.pageSchema ?? null);
}
