import React from 'react';
import useReveal from '@/hooks/useReveal';

interface SectionContentProps {
  children: React.ReactNode;
  /** Élément décoratif absolu (ex. fond de particules), ancré à la section. */
  backgroundContent?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  /**
   * Si true et que la section n'a aucune donnée à afficher (après chargement
   * et sans erreur), la section n'est pas rendue du tout (return null).
   * Permet de ne laisser aucun espace/titre/séparateur dans la page.
   */
  hideWhenEmpty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  headerContent?: React.ReactNode;
  loadingSkeletons?: React.ReactNode;
  sectionClassName?: string;
  containerClassName?: string;
  fluid?: boolean;
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
  containerClassName = '',
  fluid = false,
}) => {
  const revealRef = useReveal<HTMLElement>();
  const wrapperClass = fluid
    ? 'w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12'
    : 'section-shell';

  // Pas de chargement, pas d'erreur, ET aucune donnée : masquer complètement
  // la section (aucun DOM, aucun titre, aucun espace résiduel).
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
    // Fallback : si hideWhenEmpty=false, afficher le message vide existant.
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
      <div className={`${wrapperClass} ${containerClassName}`}>
        {headerContent}
        {content}
      </div>
    </section>
  );
};

export default SectionContent;
