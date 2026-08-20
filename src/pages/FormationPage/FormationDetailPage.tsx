import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import React, { useEffect } from 'react';
import Button from '@/components/compat/button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  CtaSection,
  EmptyState,
  PageHero,
  Breadcrumb,
  FormationDetailContent,
} from '../../components';
import { useFormationBySlug } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';
import { getFormationImage } from '../../utils/image.utils';
import DetailPageSkeleton from '../../components/common/DetailPageSkeleton';

const FormationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formation, loading, error } = useFormationBySlug(slug || '');
  const { setTitle } = useTitle();
  useTitle(formation ? formation.titre : 'Formation | ESSG');

  useEffect(() => {
    if (formation) {
      setTitle(formation.titre);
    }
  }, [formation, setTitle]);

  if (loading) {
    return <DetailPageSkeleton label="Chargement de la formation…" layout="split" />;
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<BookOpen />}
            title="Formation introuvable"
            description="La formation que vous recherchez n'existe pas ou a été supprimée."
            actionLabel="Retour aux formations"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/formations"
              variant="outlined"
              startIcon={<ArrowLeft className="size-4" />}
            >
              Toutes les formations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={getFormationImage(formation.image, formation.slug)}
        imageAlt={formation.titre}
        title={formation.titre}
        description={formation.description}
        minHeight="50vh"
      />

      {/* Fil d'Ariane */}
      <Breadcrumb
        items={[{ label: 'Formations', to: '/formations' }, { label: formation.titre }]}
      />

      {/* Contenu principal */}
      <FormationDetailContent formation={formation} />

      {/* Section CTA */}
      <CtaSection
        icon={<GraduationCap />}
        title="Intéressé par cette formation ?"
        description="Contactez-nous pour obtenir plus d'informations ou postulez dès maintenant pour rejoindre l'ESSG."
        primaryLabel="Postuler maintenant"
        primaryLink="/admission"
        secondaryLabel="Demander des informations"
        secondaryLink="/contact"
      />
    </div>
  );
};

export default FormationDetailPage;
