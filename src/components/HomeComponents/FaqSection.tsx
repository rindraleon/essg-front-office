import SectionContent from '../common/SectionContent';
import ParticlesBackground from '../animations/ParticlesBackground';
import SectionCta from '../common/SectionCta';
import SectionHeader from '../common/SectionHeader';
import { HOME_FAQ_ITEMS } from '@/constants';
import FaqAccordion from './FaqAccordion';

const SECTION_CTA = { label: 'Toutes les questions', link: '/faq' } as const;

const FaqSection = () => {
  return (
    <SectionContent
      backgroundContent={<ParticlesBackground />}
      isEmpty={HOME_FAQ_ITEMS.length === 0}
      emptyMessage="Aucune question fréquente disponible pour le moment."
      headerContent={
        <SectionHeader
          eyebrow="Aide & Réponses"
          title="Questions Fréquentes"
          description="Les réponses aux questions les plus posées sur l'admission, le cursus et la vie à l'ESSG"
        />
      }
      sectionClassName="bg-gradient-to-br from-white via-brand-50/45 to-brand-50/50 section-y"
    >
      <div className="mx-auto max-w-4xl">
        <FaqAccordion faqs={HOME_FAQ_ITEMS} />
      </div>

      <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
    </SectionContent>
  );
};

export default FaqSection;
