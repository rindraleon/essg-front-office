import { Card, CardContent, Divider, IconButton, Tooltip } from '@/components/compat/mui';
import { ArrowLeft, Calendar, Newspaper, Share2, User } from 'lucide-react';
import React, { useEffect } from 'react';
import Button from '@/components/compat/button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CtaSection, EmptyState, PageHero, Breadcrumb, CategoryChip, ImageGallery } from '../../components';
import { GREEN } from '../../constants/colors';
import { formatDate } from '../../utils/date.utils';
import { getImageUrl } from '../../utils/image.utils';
import { useActualiteBySlug, useRecentActualites } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';
import ViewDetailsButton from '../../components/common/ViewDetailsButton';
import DetailPageSkeleton from '../../components/common/DetailPageSkeleton';

const ACTUALITE_IMAGES: Record<string, string> = {
  '1': '1602052577122-f73b9710adba',
  '2': '1460186136353-977e9d6085a1',
  '3': '1768117173988-5ebfdde4fdd3',
  '4': '1773828755374-0ee802d9f44b',
  '5': '1590012314607-cda9d9b699ae',
};

const getActualiteImage = (image: string | undefined, id: string): string => {
  if (image) return getImageUrl(image);
  const hash = ACTUALITE_IMAGES[id] ?? '1594935975218-a3596da034a3';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
};

const ActualiteDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { actualite, loading, error } = useActualiteBySlug(slug || '');
  const { actualites: related } = useRecentActualites(6);
  const { setTitle } = useTitle();

  useEffect(() => {
    if (actualite) {
      setTitle(actualite.titre);
    }
  }, [actualite, setTitle]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: actualite?.titre,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return <DetailPageSkeleton label="Chargement de l'article…" layout="article" />;
  }

  if (error || !actualite) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<Newspaper />}
            title="Article introuvable"
            description="L'article que vous recherchez n'existe pas ou a été supprimé."
            actionLabel="Retour aux actualités"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/actualites"
              variant="outlined"
              startIcon={<ArrowLeft className="size-4" />}
            >
              Toutes les actualités
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={getActualiteImage(actualite.image, actualite.id.toString())}
        imageAlt={actualite.titre}
        title={actualite.titre}
        minHeight="50vh"
      />

      {/* Fil d'Ariane */}
      <Breadcrumb
        items={[{ label: 'Actualités', to: '/actualites' }, { label: actualite.titre }]}
      />

      {/* Contenu */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Article */}
          <div className="lg:col-span-2">
            <Card
            >
              <CardContent className="p-6 sm:p-8">
                {/* Meta */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <CategoryChip
                    category={actualite.categorie}
                    size="small"
                  />

                  <div className="flex items-center gap-1 text-small text-ink-500">
                    <Calendar />
                    {formatDate(actualite.date)}
                  </div>

                  <div className="flex items-center gap-1 text-small text-ink-500">
                    <User />
                    {actualite.auteur}
                  </div>

                  <Tooltip title="Partager">
                    <IconButton
                      size="small"
                      onClick={handleShare}
                    >
                      <Share2 />
                    </IconButton>
                  </Tooltip>
                </div>

                <Divider className="mb-6" />

                {/* Contenu de l'article */}
                <div className="prose max-w-none text-ink-700">
                  <p className="mb-4 text-h5 font-medium leading-relaxed">{actualite.resume}</p>

                  {actualite.contenu ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: actualite.contenu,
                      }}
                    />
                  ) : (
                    <>
                      <p className="mb-4 leading-relaxed">{actualite.contenu}</p>
                      <p className="leading-relaxed">
                        Pour plus d'informations, n'hésitez pas à nous contacter ou à consulter nos
                        autres actualités.
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {(actualite.galerie?.length ?? 0) > 0 && (
              <div className="mt-6">
                <ImageGallery
                  images={actualite.galerie ?? []}
                  alt={actualite.titre}
                  title="Galerie de l'événement"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Infos auteur */}
            <Card
            >
              <CardContent className="p-6">
                <h3 className="mb-4 text-small font-semibold uppercase tracking-wide text-ink-900">
                  Auteur
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: GREEN[50],
                    }}
                  >
                    <User />
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">{actualite.auteur}</div>
                    <div className="text-small text-ink-500">ESSG</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bouton retour */}
            <Button
              component={RouterLink}
              to="/actualites"
              variant="outlined"
              fullWidth
              startIcon={<ArrowLeft className="size-4" />}
            >
              Toutes les actualités
            </Button>
          </div>
        </div>
      </div>

      {related.filter((item) => item.slug !== actualite.slug).length > 0 && (
        <section className="border-t border-ink-100 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-h3 text-ink-900">Actualités similaires</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related
                .filter((item) => item.slug !== actualite.slug)
                .slice(0, 3)
                .map((item) => (
                  <article key={item.id} className="rounded-2xl border border-ink-100 bg-ink-50/60 p-5">
                    <p className="text-caption font-semibold uppercase tracking-wide text-brand-700">{item.categorie}</p>
                    <h3 className="mt-2 text-body font-semibold text-ink-900">{item.titre}</h3>
                    <ViewDetailsButton
                      to={`/actualites/${item.slug}`}
                      className="mt-3"
                      ariaLabel={`Voir le détail de ${item.titre}`}
                    />
                  </article>
                ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection
        icon={<Newspaper />}
        title="Ne manquez aucune actualité"
        description="Abonnez-vous à notre newsletter pour recevoir les dernières nouvelles de l'ESSG directement dans votre boîte mail."
        primaryLabel="S'abonner"
        primaryLink="/contact"
        secondaryLabel="Voir les formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default ActualiteDetailPage;
