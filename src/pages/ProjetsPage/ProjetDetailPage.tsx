import { Card, CardContent } from '@/components/compat/mui';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Database,
  Flag,
  GraduationCap,
  Map,
  MapPin,
  Rocket,
  Banknote,
} from 'lucide-react';
import React, { useEffect } from 'react';
import Button from '@/components/compat/button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  CtaSection,
  EmptyState,
  PageHero,
  Breadcrumb,
  MapEmbed,
  ProjetGallery,
} from '../../components';
import { GREEN } from '../../constants/colors';
import { useProjetBySlug } from '../../hooks/useProjets';
import { useTitle } from '../../hooks/useTitle';
import { getImageUrl } from '../../utils/image.utils';
import DetailPageSkeleton from '../../components/common/DetailPageSkeleton';

const getProjetImage = (image: string | undefined, slug: string): string => {
  if (image) {
    return getImageUrl(image);
  }
  // Images par défaut selon le slug
  const defaultImages: Record<string, string> = {
    international: '1453732638553-7c9b5c6c5c0a',
    'service-public': '1586773867938-d2e2e7e7e7e7',
    recherche: '1532094348800-1c5e8e7e7e7e7',
    innovation: '1518770660439-4636190af475',
  };

  const hash = defaultImages[slug] || '1451187580459-43490279c0fa';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
};

const ProjetDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projet, loading, error } = useProjetBySlug(slug || '');
  const { setTitle } = useTitle();
  useTitle(projet ? projet.titre : 'Projet | ESSG');

  useEffect(() => {
    if (projet) {
      setTitle(projet.titre);
    }
  }, [projet, setTitle]);

  if (loading) {
    return <DetailPageSkeleton label="Chargement du projet…" layout="split" />;
  }

  if (error || !projet) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<Rocket />}
            title="Projet introuvable"
            description="Le projet que vous recherchez n'existe pas ou a été supprimé."
            actionLabel="Retour aux projets"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/projets"
              variant="outlined"
              startIcon={<ArrowLeft className="size-4" />}
            >
              Tous les projets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getProjetImage(projet.image, projet.slug);
  const isFinished =
    projet.statut.toLowerCase() === 'terminé' || projet.statut.toLowerCase() === 'terminee';

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={imageUrl}
        imageAlt={projet.titre}
        title={projet.titre}
        description={projet.description}
        minHeight="50vh"
      />

      {/* Fil d'Ariane */}
      <Breadcrumb items={[{ label: 'Projets', to: '/projets' }, { label: projet.titre }]} />

      {/* Contenu principal */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* En-tête avec badges et titre */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-small font-medium text-white shadow-card">
              {projet.type}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-white px-4 py-2 text-small text-ink-700">
              <Calendar />
              {projet.annee}
            </span>

            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-small font-medium text-white"
              style={{
                backgroundColor: isFinished ? '#059669' : '#f59e0b',
              }}
            >
              <Flag />
              {projet.statut}
            </span>
          </div>

          <h1 className="text-h2 text-ink-900">{projet.titre}</h1>
          <p className="mt-2 text-body text-ink-600">{projet.description}</p>
        </div>

        {/* Grille principale : sidebar gauche + contenu droit */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne gauche - Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Carte Informations clés */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-5 text-caption font-semibold uppercase tracking-wider text-ink-500">
                  Informations clés
                </h3>

                <div className="space-y-5">
                  {/* Statut */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: isFinished ? '#d1fae5' : '#fef3c7',
                      }}
                    >
                      <Flag />
                    </div>
                    <div className="flex-1">
                      <div className="text-small text-ink-500">Statut</div>
                      <span
                        className="mt-1 inline-block rounded-md px-2 py-0.5 text-caption font-semibold uppercase"
                        style={{
                          color: isFinished ? '#059669' : '#d97706',
                          backgroundColor: isFinished ? '#d1fae5' : '#fef3c7',
                        }}
                      >
                        {projet.statut}
                      </span>
                    </div>
                  </div>

                  {/* Année */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-100">
                      <Calendar />
                    </div>
                    <div className="flex-1">
                      <div className="text-small text-ink-500">Année de livraison</div>
                      <div className="mt-0.5 text-body font-semibold text-ink-900">
                        {projet.annee}
                      </div>
                    </div>
                  </div>

                  {/* Localisation */}
                  {projet.location && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
                        <MapPin />
                      </div>
                      <div className="flex-1">
                        <div className="text-small text-ink-500">Localisation</div>
                        <div className="mt-0.5 text-body font-semibold text-ink-900">
                          {projet.location.ville}, {projet.location.pays}
                        </div>
                        {projet.location.adresse && (
                          <div className="mt-0.5 text-small text-ink-500">
                            {projet.location.adresse}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Budget (optionnel) */}
                  {projet.budget && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-100">
                        <Banknote />
                      </div>
                      <div className="flex-1">
                        <div className="text-small text-ink-500">Budget</div>
                        <div className="mt-0.5 text-body font-semibold text-ink-900">
                          {projet.budget}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sources de données */}
                  {projet.sources && projet.sources.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sage-100">
                        <Database />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-small text-ink-500">Sources de données</div>
                        <ul className="mt-1.5 space-y-1.5">
                          {projet.sources.map((source) => (
                            <li key={`${source.title}-${source.url}`}>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex max-w-full items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-3 py-2 text-small font-medium text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                              >
                                <span className="truncate">{source.title}</span>
                                <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Carte Partenaires */}
            {projet.partenaires && projet.partenaires.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full" style={{ backgroundColor: GREEN[600] }} />
                    <h3 className="text-h5 font-semibold text-ink-900">Partenaires</h3>
                  </div>

                  <div className="space-y-3">
                    {projet.partenaires.map((partenaire: string, index: number) => {
                      // Support des partenaires en string ou objet {nom, type}
                      const nom = partenaire;

                      return (
                        <div
                          key={nom + index}
                          className="flex items-center gap-3 rounded-xl bg-brand-50/60 ring-1 ring-brand-100/60 p-3"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                            <GraduationCap />
                          </div>
                          <div className="flex-1">
                            <div className="text-small font-semibold text-ink-900">{nom}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne droite - Contenu principal */}
          <div className="space-y-6 lg:col-span-2">
            {projet.location && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
                      <Map />
                    </div>
                    <h3 className="text-h5 font-semibold text-ink-900">Localisation du projet</h3>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-ink-100 bg-ink-100 shadow-card">
                    <MapEmbed
                      lat={projet.location.lat}
                      lng={projet.location.lng}
                      label={`${projet.location.ville}, ${projet.location.pays}`}
                      adresse={projet.location.adresse}
                      zoom="city"
                    />

                    {/* Étiquette overlay en bas */}
                    <div className="flex items-center justify-center gap-2 border-t border-ink-100 bg-white px-4 py-3 text-center">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: GREEN[600] }}
                      />
                      <span className="text-small font-medium text-ink-900">
                        {projet.location.adresse ||
                          `${projet.location.ville}, ${projet.location.pays}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Objectifs (si présents) */}
            {projet.objectifs && projet.objectifs.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full" style={{ backgroundColor: GREEN[600] }} />
                    <h3 className="text-h5 font-semibold text-ink-900">Objectifs du projet</h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {projet.objectifs.map((objectif: string, index: number) => (
                      <div
                        key={objectif + index}
                        className="flex items-start gap-3 rounded-xl border border-ink-100 bg-ink-50/60 p-4"
                      >
                        <span
                          className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: GREEN[600] }}
                        />
                        <span className="text-small leading-6 text-ink-700">{objectif}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Galerie d'images */}
            {projet.galerie && projet.galerie.length > 0 && (
              <ProjetGallery images={projet.galerie} alt={projet.titre} />
            )}

            {/* Bouton retour */}
            <Button
              component={RouterLink}
              to="/projets"
              variant="outlined"
              fullWidth
              startIcon={<ArrowLeft className="size-4" />}
            >
              Tous les projets
            </Button>
          </div>
        </div>
      </div>

      <CtaSection
        icon={<Rocket />}
        title="Vous avez un projet de recherche ?"
        description="Collaborez avec l'ESSG pour vos projets de recherche, d'innovation ou de développement en sciences géomatiques."
        primaryLabel="Nous contacter"
        primaryLink="/contact"
        secondaryLabel="Voir nos formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default ProjetDetailPage;
