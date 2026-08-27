import { CircleHelp } from 'lucide-react';
import React from 'react';

import type { FaqPageProps } from '@/types';
import { ContactCard, FaqAccordion, PageHero, Breadcrumb } from '@/components';

import { FAQ_ITEMS, SITE_HERO_IMAGE } from '@/constants';
import { useTitle } from '@/hooks';

const HERO_IMAGE = SITE_HERO_IMAGE;

const FaqPage: React.FC<FaqPageProps> = (props: Readonly<FaqPageProps>) => {
  useTitle('FAQ | ESSG');

  const {
    pageTitle = 'Questions Fréquentes',
    pageDescription = "Trouvez rapidement les réponses aux questions les plus posées sur l'ESSG, les formations et les admissions.",
    faqs = FAQ_ITEMS,
  } = props;

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="FAQ ESSG"
        title={pageTitle}
        description={pageDescription}
      />

      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <section className="section-y-tight">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FaqAccordion faqs={faqs} />

          <div className="mt-8">
            <ContactCard icon={<CircleHelp />} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
