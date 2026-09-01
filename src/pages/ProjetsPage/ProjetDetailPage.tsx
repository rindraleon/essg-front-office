import {
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  Calendar,
  CheckCircle2,
  Database,
  Flag,
  Handshake,
  MapPin,
  Rocket,
} from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  DetailHero,
  EmptyState,
  MapEmbed,
  ProjetGallery,
  DetailPageSkeleton,
  RevealOnScroll,
} from '@/components';
import { useProjetBySlug, useTitle } from '@/hooks';
import { getImageUrl } from '@/utils';

function getProjetImage(image: string | undefined, slug: string): string {
  if (image) return getImageUrl(image);
  const defaults: Record<string, string> = {
    international: '1453732638553-7c9b5c6c5c0a',
    'service-public': '1586773867938-d2e2e7e7e7e7',
    recherche: '1532094348800-1c5e8e7e7e7e7',
    innovation: '1518770660439-4636190af475',
  };
  const hash = defaults[slug] ?? '1451187580459-43490279c0fa';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
}

const ProjetDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projet, loading, error } = useProjetBySlug(slug || '');
  const { setTitle } = useTitle();

  useEffect(() => {
    if (projet) setTitle(projet.titre);
  }, [projet, setTitle]);

  const galleryImages = useMemo(() => {
    if (!projet?.galerie) return [];
    return projet.galerie.filter((image) => image && image !== projet.image);
  }, [projet]);

  if (loading) return <DetailPageSkeleton label="Chargement du projet…" layout="split" />;

  if (error || !projet) {
    return (
      <div className="min-h-screen bg-ink-50 px-5 section-y">
        <EmptyState
          icon={<Rocket />}
          title="Projet introuvable"
          description="Le projet que vous recherchez n'existe pas ou a été supprimé."
          actionLabel="Retour aux projets"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const coverImage = getProjetImage(projet.image, projet.slug);
  const locationLabel = projet.location
    ? `${projet.location.ville}, ${projet.location.pays}`
    : 'Madagascar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-50 via-white to-brand-50/30">
      <DetailHero
        eyebrow={projet.type || 'Projet ESSG'}
        title={projet.titre}
        description={projet.description}
        image={coverImage}
        imageAlt={projet.titre}
        backTo="/projets"
        backLabel="Tous les projets"
        meta={[
          { icon: Calendar, label: projet.annee },
          { icon: Flag, label: projet.statut },
          { icon: MapPin, label: locationLabel },
        ]}
      />

      <Breadcrumb items={[{ label: 'Projets', to: '/projets' }, { label: projet.titre }]} />

      <main className="section-shell section-y-tight">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="space-y-7">
            <RevealOnScroll>
              <section className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-9">
                <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                  Le projet
                </span>
                <h2 className="mt-3 text-h2 text-ink-950">Contexte et ambition</h2>
                <p className="mt-5 whitespace-pre-wrap text-body-lg leading-8 text-ink-600">
                  {projet.description}
                </p>
              </section>
            </RevealOnScroll>

            {projet.objectifs && projet.objectifs.length > 0 && (
              <RevealOnScroll delay={80}>
                <section className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 sm:p-9">
                  <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                    Résultats attendus
                  </span>
                  <h2 className="mt-3 text-h3 text-ink-950">Objectifs du projet</h2>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {projet.objectifs.map((objectif, index) => (
                      <li
                        key={objectif}
                        className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-white p-4"
                      >
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-700 font-tech text-caption text-white">
                          {index + 1}
                        </span>
                        <span className="text-small leading-6 text-ink-700">{objectif}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </RevealOnScroll>
            )}

            {projet.location && (
              <RevealOnScroll delay={120}>
                <section className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
                  <div className="flex items-center justify-between gap-4 p-6 sm:p-7">
                    <div>
                      <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                        Implantation
                      </span>
                      <h2 className="mt-2 text-h3 text-ink-950">Localisation du projet</h2>
                    </div>
                    <MapPin className="size-7 text-brand-600" />
                  </div>
                  <div className="border-t border-ink-100">
                    <MapEmbed
                      lat={projet.location.lat}
                      lng={projet.location.lng}
                      label={locationLabel}
                      adresse={projet.location.adresse}
                      zoom="city"
                    />
                  </div>
                </section>
              </RevealOnScroll>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <RevealOnScroll variant="fade-right">
              <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                <h2 className="text-h5 text-ink-950">Informations clés</h2>
                <dl className="mt-6 space-y-5">
                  <div className="flex gap-3">
                    <Flag className="mt-0.5 size-5 text-brand-600" />
                    <div>
                      <dt className="text-caption text-ink-400">Statut</dt>
                      <dd className="font-semibold text-ink-900">{projet.statut}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calendar className="mt-0.5 size-5 text-brand-600" />
                    <div>
                      <dt className="text-caption text-ink-400">Année</dt>
                      <dd className="font-semibold text-ink-900">{projet.annee}</dd>
                    </div>
                  </div>
                  {projet.budget && (
                    <div className="flex gap-3">
                      <Banknote className="mt-0.5 size-5 text-brand-600" />
                      <div>
                        <dt className="text-caption text-ink-400">Budget</dt>
                        <dd className="font-semibold text-ink-900">{projet.budget}</dd>
                      </div>
                    </div>
                  )}
                </dl>
              </section>
            </RevealOnScroll>

            {projet.partenaires && projet.partenaires.length > 0 && (
              <RevealOnScroll variant="fade-right" delay={80}>
                <section className="rounded-2xl border border-brand-100 bg-brand-50/70 p-6">
                  <h2 className="flex items-center gap-2 text-h5 text-ink-950">
                    <Handshake className="size-5 text-brand-700" />
                    Partenaires
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {projet.partenaires.map((partenaire) => (
                      <li
                        key={partenaire}
                        className="flex items-start gap-2 text-small text-ink-700"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" />
                        {partenaire}
                      </li>
                    ))}
                  </ul>
                </section>
              </RevealOnScroll>
            )}

            {projet.sources && projet.sources.length > 0 && (
              <RevealOnScroll variant="fade-right" delay={140}>
                <section className="rounded-2xl border border-ink-100 bg-ink-950 p-6 text-white">
                  <h2 className="flex items-center gap-2 text-h5">
                    <Database className="size-5 text-brand-300" />
                    Sources
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {projet.sources.map((source) => (
                      <li key={`${source.title}-${source.url}`}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-small text-white/75 hover:bg-white/10 hover:text-white"
                        >
                          <span className="truncate">{source.title}</span>
                          <ArrowUpRight className="size-4 shrink-0 text-brand-300" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              </RevealOnScroll>
            )}
          </aside>
        </div>
      </main>

      {galleryImages.length > 0 && (
        <section className="border-y border-ink-100 bg-brand-50/55 section-y-tight">
          <div className="section-shell">
            <RevealOnScroll className="mb-9 max-w-2xl">
              <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                Documentation visuelle
              </span>
              <h2 className="mt-3 text-h2 text-ink-950">Galerie du projet</h2>
              <p className="mt-3 text-ink-500">
                Les images de la galerie restent distinctes de l’image de couverture.
              </p>
            </RevealOnScroll>
            <ProjetGallery images={galleryImages} alt={projet.titre} />
          </div>
        </section>
      )}

      <div className="section-shell py-10">
        <Link
          to="/projets"
          className="inline-flex items-center gap-2 text-small font-semibold text-brand-700 hover:text-brand-800"
        >
          <ArrowLeft className="size-4" />
          Tous les projets
        </Link>
      </div>
    </div>
  );
};

export default ProjetDetailPage;
