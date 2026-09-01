import { ArrowLeft, Calendar, Clock3, Newspaper, Share2, User } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  CategoryChip,
  DetailHero,
  EmptyState,
  ImageGallery,
  DetailPageSkeleton,
  RevealOnScroll,
} from '@/components';
import { useActualiteBySlug, useRecentActualites, useTitle } from '@/hooks';
import { formatDate, getImageUrl } from '@/utils';

const ACTUALITE_IMAGES: Record<string, string> = {
  '1': '1602052577122-f73b9710adba',
  '2': '1460186136353-977e9d6085a1',
  '3': '1768117173988-5ebfdde4fdd3',
  '4': '1773828755374-0ee802d9f44b',
  '5': '1590012314607-cda9d9b699ae',
};

function getActualiteImage(image: string | undefined, id: string): string {
  if (image) return getImageUrl(image);
  const hash = ACTUALITE_IMAGES[id] ?? '1594935975218-a3596da034a3';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
}

const ActualiteDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { actualite, loading, error } = useActualiteBySlug(slug || '');
  const { actualites: related } = useRecentActualites(6);
  const { setTitle } = useTitle();

  useEffect(() => {
    if (actualite) setTitle(actualite.titre);
  }, [actualite, setTitle]);

  const galleryImages = useMemo(() => {
    if (!actualite?.galerie) return [];
    return actualite.galerie.filter((image) => image && image !== actualite.image);
  }, [actualite]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: actualite?.titre, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié dans le presse-papiers');
      }
    } catch {
      return;
    }
  };

  if (loading) return <DetailPageSkeleton label="Chargement de l'article…" layout="article" />;

  if (error || !actualite) {
    return (
      <div className="min-h-screen bg-ink-50 px-5 section-y">
        <EmptyState
          icon={<Newspaper />}
          title="Article introuvable"
          description="L'article que vous recherchez n'existe pas ou a été supprimé."
          actionLabel="Retour aux actualités"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const coverImage = getActualiteImage(actualite.image, String(actualite.id));
  const relatedItems = related.filter((item) => item.slug !== actualite.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-50 via-white to-brand-50/30">
      <DetailHero
        eyebrow={actualite.categorie || 'Actualité ESSG'}
        title={actualite.titre}
        description={actualite.resume}
        image={coverImage}
        imageAlt={actualite.titre}
        backTo="/actualites"
        backLabel="Toutes les actualités"
        meta={[
          { icon: Calendar, label: formatDate(actualite.date) },
          { icon: User, label: actualite.auteur || 'ESSG' },
          { icon: Clock3, label: 'Lecture 4 min' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => void handleShare()}
            className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-5 py-2.5 text-small font-bold text-brand-950 transition-[transform,background-color] hover:bg-brand-300 motion-reduce:transform-none"
          >
            <Share2 className="size-4" />
            Partager l’article
          </button>
        }
      />

      <Breadcrumb
        items={[{ label: 'Actualités', to: '/actualites' }, { label: actualite.titre }]}
      />

      <main className="section-shell grid gap-8 section-y-tight lg:grid-cols-[minmax(0,1fr)_18rem]">
        <RevealOnScroll variant="fade-up">
          <article className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
            <div className="p-6 sm:p-9 lg:p-12">
              <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-ink-100 pb-6">
                <CategoryChip category={actualite.categorie} size="small" />
                <span className="text-small text-ink-500">
                  Publié le {formatDate(actualite.date)}
                </span>
              </div>
              {actualite.resume && (
                <p className="mb-8 border-l-4 border-brand-400 pl-5 text-h5 leading-8 text-ink-800">
                  {actualite.resume}
                </p>
              )}
              {actualite.contenu ? (
                <div
                  className="prose prose-lg max-w-none text-ink-700 prose-headings:text-ink-950 prose-a:text-brand-700"
                  dangerouslySetInnerHTML={{ __html: actualite.contenu }}
                />
              ) : (
                <p className="leading-8 text-ink-600">
                  Pour plus d’informations, contactez l’ESSG ou consultez nos autres actualités.
                </p>
              )}
            </div>
          </article>
        </RevealOnScroll>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <RevealOnScroll variant="fade-right" delay={100}>
            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
              <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                Publication
              </span>
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-caption text-ink-400">Auteur</dt>
                  <dd className="mt-1 font-semibold text-ink-900">{actualite.auteur || 'ESSG'}</dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-400">Catégorie</dt>
                  <dd className="mt-1 font-semibold text-ink-900">{actualite.categorie}</dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-400">Date</dt>
                  <dd className="mt-1 font-semibold text-ink-900">{formatDate(actualite.date)}</dd>
                </div>
              </dl>
            </div>
          </RevealOnScroll>
          <Link
            to="/actualites"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-3 text-small font-semibold text-ink-800 hover:border-brand-300 hover:text-brand-700"
          >
            <ArrowLeft className="size-4" /> Toutes les actualités
          </Link>
        </aside>
      </main>

      {galleryImages.length > 0 && (
        <section className="border-y border-ink-100 bg-brand-50/45 section-y-tight">
          <div className="section-shell">
            <RevealOnScroll className="mb-9 max-w-2xl">
              <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                En images
              </span>
              <h2 className="mt-3 text-h2 text-ink-950">Galerie de l’événement</h2>
              <p className="mt-3 text-ink-500">
                La galerie est présentée séparément de l’image de couverture.
              </p>
            </RevealOnScroll>
            <ImageGallery images={galleryImages} alt={actualite.titre} />
          </div>
        </section>
      )}

      {relatedItems.length > 0 && (
        <section className="bg-white section-y-tight">
          <div className="section-shell">
            <h2 className="text-h3 text-ink-950">À lire également</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {relatedItems.map((item, index) => (
                <RevealOnScroll key={item.id} delay={index * 80}>
                  <Link
                    to={`/actualites/${item.slug}`}
                    className="group block h-full rounded-2xl border border-ink-100 bg-ink-50/55 p-5 transition-[transform,border-color,box-shadow] hover:border-brand-200 hover:shadow-card-hover motion-reduce:transform-none"
                  >
                    <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                      {item.categorie}
                    </span>
                    <h3 className="mt-3 text-h5 text-ink-950 group-hover:text-brand-700">
                      {item.titre}
                    </h3>
                    <p className="mt-4 text-small text-ink-500">{formatDate(item.date)}</p>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ActualiteDetailPage;
