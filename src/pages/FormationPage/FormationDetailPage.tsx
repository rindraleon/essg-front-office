import { Award, BookOpen, Clock, GraduationCap } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Breadcrumb,
  DetailHero,
  EmptyState,
  FormationDetailContent,
  DetailPageSkeleton,
} from '@/components';
import { useFormationBySlug, useSeo } from '@/hooks';
import { getFormationImage } from '@/utils';

const FormationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formation, loading, error } = useFormationBySlug(slug || '');

  useSeo({
    title: formation ? formation.titre : undefined,
    description: formation?.description,
    image: formation ? getFormationImage(formation.image, formation.slug) : undefined,
    pageSchema: formation
      ? {
          '@type': 'Course',
          name: formation.titre,
          description: formation.description,
          educationalLevel: formation.niveau,
          ...(formation.credits ? { credits: formation.credits } : {}),
          isAccessibleForFree: false,
          inLanguage: 'fr',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'École Supérieure des Sciences Géomatiques (ESSG)',
          },
        }
      : null,
  });

  if (loading) return <DetailPageSkeleton label="Chargement de la formation…" layout="split" />;

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-ink-50 px-5 section-y">
        <EmptyState
          icon={<BookOpen />}
          title="Formation introuvable"
          description="La formation que vous recherchez n'existe pas ou a été supprimée."
          actionLabel="Retour aux formations"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-50 via-white to-brand-50/35">
      <DetailHero
        eyebrow={formation.mention || 'Formation ESSG'}
        title={formation.titre}
        description={formation.description}
        image={getFormationImage(formation.image, formation.slug)}
        imageAlt={formation.titre}
        backTo="/formations"
        backLabel="Toutes les formations"
        meta={[
          { icon: GraduationCap, label: formation.niveau },
          { icon: Clock, label: formation.duree },
          ...(formation.credits ? [{ icon: Award, label: `${formation.credits} crédits` }] : []),
        ]}
        actions={
          <>
            <a
              href="#programme"
              className="inline-flex items-center rounded-full bg-brand-400 px-5 py-2.5 text-small font-bold text-brand-950 hover:bg-brand-300"
            >
              Voir le programme
            </a>
            {formation.email && (
              <a
                href={`mailto:${formation.email}`}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.08] px-5 py-2.5 text-small font-semibold text-white backdrop-blur-md hover:bg-white/[0.14]"
              >
                Contacter la formation
              </a>
            )}
          </>
        }
      />
      <Breadcrumb
        items={[{ label: 'Formations', to: '/formations' }, { label: formation.titre }]}
      />
      <FormationDetailContent formation={formation} />
    </div>
  );
};

export default FormationDetailPage;
