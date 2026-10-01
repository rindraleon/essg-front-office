import React from 'react';
import useReveal from '@/hooks/useReveal';

interface SectionContentProps {
  children: React.ReactNode;

  backgroundContent?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;

  hideWhenEmpty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  headerContent?: React.ReactNode;
  loadingSkeletons?: React.ReactNode;
  sectionClassName?: string;
}

const SectionContent: React.FC<SectionContentProps> = ({
  children,
  loading = false,
  error = null,
  isEmpty = false,
  hideWhenEmpty = true,
  emptyMessage = 'Aucune donnée disponible.',
  errorMessage = 'Une erreur est survenue.',
  headerContent,
  loadingSkeletons,
  backgroundContent,
  sectionClassName = '',
}) => {
  const revealRef = useReveal<HTMLElement>();

  if (!loading && !error && isEmpty && hideWhenEmpty) {
    return null;
  }

  let content: React.ReactNode;

  if (loading) {
    content = loadingSkeletons;
  } else if (error) {
    content = (
      <div className="section-y-tight text-center">
        <p className="text-ink-500">{errorMessage}</p>
      </div>
    );
  } else if (isEmpty) {
    content = <div className="section-y-tight text-center text-ink-500">{emptyMessage}</div>;
  } else {
    content = children;
  }

  return (
    <section
      ref={revealRef}
      className={`reveal-section ${backgroundContent ? 'relative overflow-hidden' : ''} ${sectionClassName}`}
    >
      {backgroundContent}
      <div className="section-shell">
        {headerContent}
        {content}
      </div>
    </section>
  );
};

export default SectionContent;
