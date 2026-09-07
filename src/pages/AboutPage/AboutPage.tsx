import React from 'react';
import {
  AboutCampus,
  AboutHero,
  AboutIntro,
  AboutMission,
  AboutObjectives,
  AboutTeam,
  AboutTimeline,
  AboutValues,
  AboutVision,
} from '@/components';
import { useTitle } from '@/hooks';

const AboutPage: React.FC = () => {
  useTitle('À propos');

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-ink-50)]">
      <AboutHero />
      <AboutIntro />
      <AboutVision />
      <AboutMission />
      <AboutValues />
      <AboutTimeline />
      <AboutObjectives />
      <AboutTeam />
      <AboutCampus />
    </div>
  );
};

export default AboutPage;
