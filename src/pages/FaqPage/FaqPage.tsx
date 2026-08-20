import { CircleHelp, GraduationCap } from 'lucide-react';
import React from 'react';

import type { FaqPageProps } from '../../types/faq.types';
import { ContactCard, CtaSection, FaqAccordion, PageHero, Breadcrumb } from '../../components';

import { SITE_HERO_IMAGE } from '../../constants/media';
import { useTitle } from '@/hooks/useTitle';

const HERO_IMAGE = SITE_HERO_IMAGE;

const FaqPage: React.FC<FaqPageProps> = (props: Readonly<FaqPageProps>) => {
  useTitle('FAQ | ESSG');

  const {
    pageTitle = 'Questions Fréquentes',
    pageDescription = "Trouvez rapidement les réponses aux questions les plus posées sur l'ESSG, les formations et les admissions.",
    faqs = [
      {
        question: "Quelles sont les conditions d'admission à l'ESSG ?",
        reponse:
          "L'admission à l'ESSG se fait sur dossier et entretien. Les candidats doivent être titulaires d'un baccalauréat scientifique ou équivalent pour la licence. Pour le master, une licence en géomatique ou domaine connexe est requise.",
      },
      {
        question: 'Quelle est la durée des formations ?',
        reponse:
          'La licence dure 3 ans (6 semestres), le master dure 2 ans (4 semestres). Des formations continues et certifiantes de courte durée sont également proposées.',
      },
      {
        question: "L'ESSG propose-t-elle des bourses ?",
        reponse:
          "Oui, l'ESSG dispose de bourses d'excellence et de bourses sociales. Les étudiants peuvent également bénéficier de bourses de nos partenaires internationaux.",
      },
      {
        question: "Quels sont les débouchés après une formation à l'ESSG ?",
        reponse:
          "Les diplômés de l'ESSG travaillent dans divers secteurs : cartographie, télédétection, SIG, aménagement du territoire, environnement, urbanisme, agriculture de précision, etc. Le taux d'insertion professionnelle est de 95%.",
      },
      {
        question: "L'ESSG propose-t-elle des stages ?",
        reponse:
          "Oui, chaque formation inclut des périodes de stage obligatoires en entreprise ou en laboratoire de recherche. L'ESSG dispose d'un réseau de partenaires nationaux et internationaux pour faciliter les stages.",
      },
      {
        question: "Comment contacter l'ESSG ?",
        reponse:
          'Vous pouvez nous contacter par email à contact@essg.mg, par téléphone au +261 34 28 085 30, ou en vous rendant directement à notre campus situé à Andrainjato, Fianarantsoa.',
      },
    ],
  } = props;

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="FAQ ESSG"
        title={pageTitle}
        description={pageDescription}
        stats={[
          { value: `${faqs.length}`, label: 'Questions' },
          { value: '24/7', label: 'Support' },
          { value: '< 24h', label: 'Temps de réponse' },
        ]}
      />

      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FaqAccordion faqs={faqs} />

          <div className="mt-8">
            <ContactCard
              icon={
                <CircleHelp
                />
              }
            />
          </div>
        </div>
      </section>

      <CtaSection
        icon={<GraduationCap />}
        title="Prêt à rejoindre l'ESSG ?"
        description="Commencez votre parcours vers l'excellence en sciences géomatiques dès maintenant."
        primaryLabel="Postuler maintenant"
        primaryLink="/admission"
        secondaryLabel="Voir les formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default FaqPage;
