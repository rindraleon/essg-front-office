import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  Mail,
  PlayCircle,
  Star,
  User,
  Award,
  ListOrdered,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { getImageUrl } from '../../utils/image.utils';
import ResponsableCard from './ResponsableCard';
import type { FormationDetailContentProps } from '../../types/formations.types';

const FormationDetailContent: React.FC<FormationDetailContentProps> = (
  props: Readonly<FormationDetailContentProps>
) => {
  const { formation } = props;
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [showAllModules, setShowAllModules] = useState(false);

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  /*
    Programme de la formation.

    Deux formats coexistent en base :
      - `programme` : liste de libellés, alimentée par le back-office ;
      - `modules`   : ancienne structure { semestre, cours[] }, figée.

    Le composant ne lisait que `modules`, si bien que le programme saisi
    dans le back-office n'apparaissait jamais sur le site public. Les deux
    sources sont désormais normalisées vers une même forme, `programme`
    étant prioritaire puisque c'est le champ réellement alimenté.
  */
  const modulesAffiches = useMemo(() => {
    if (formation.programme && formation.programme.length > 0) {
      return formation.programme
        .filter((intitule) => intitule.trim().length > 0)
        .map((intitule) => ({ titre: intitule, cours: [] as string[] }));
    }

    return (formation.modules ?? []).map((module) => ({
      titre: module.semestre,
      cours: module.cours ?? [],
    }));
  }, [formation.programme, formation.modules]);

  const visibleModules = showAllModules ? modulesAffiches : modulesAffiches.slice(0, 3);

  const remainingModulesCount = Math.max(modulesAffiches.length - 3, 0);

  /** Nombre total de leçons, nul pour un programme sous forme de liste. */
  const totalLecons = modulesAffiches.reduce((total, module) => total + module.cours.length, 0);

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 antialiased">
      {/* ──────────────────── Hero Section ──────────────────── */}
      <header className="relative overflow-hidden bg-brand-50">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-4 py-8 md:flex-row md:px-8">
          {/* Left column — text */}
          <div className="z-10 w-full space-y-4 md:w-1/2">
            

            {/* Title */}
            <h1 className="text-h2 font-extrabold leading-[40px] tracking-tight text-ink-900 md:leading-[56px] md:tracking-[-0.02em]">
              {formation.titre}
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-h5 leading-7 text-ink-500">
              {formation.description}
            </p>

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-4 text-small text-ink-500">
              {formation.duree && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formation.duree}
                </span>
              )}
              {formation.niveau && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {formation.niveau}
                </span>
              )}
              {formation.credits && (
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {formation.credits} crédits ECTS
                </span>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              {formation.email && (
                <a
                  href={`mailto:${formation.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink-900 px-8 py-3 text-small font-semibold text-white transition-colors hover:bg-ink-800"
                >
                  <Mail className="h-4 w-4" />
                  Contacter la formation
                </a>
              )}
              <a
                href="#programme"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-900 bg-transparent px-8 py-3 text-small font-semibold text-ink-900 transition-colors hover:bg-brand-50"
              >
                <ListOrdered className="h-4 w-4" />
                Voir le programme
              </a>
            </div>
          </div>

          {/* Right column — cover image */}
          <div className="relative w-full md:w-1/2">
            {formation.image && (
              <div className="aspect-video overflow-hidden rounded-xl border-4 border-white shadow-[0px_12px_32px_rgba(15,23,42,0.12)]">
                <img
                  src={getImageUrl(formation.image)}
                  alt={formation.titre}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Decorative background */}
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-1/3 rounded-l-full bg-gradient-to-l from-brand-50 to-transparent opacity-50 blur-3xl" />
      </header>

      {/* ──────────────────── Main Content Grid ──────────────────── */}
      <section className="mx-auto grid max-w-[1280px] grid-cols-4 gap-6 px-4 py-16 md:grid-cols-12 md:px-8">
        {/* ════════ Left / Main column ════════ */}
        <div className="col-span-4 space-y-8 md:col-span-8">
          {/* ── About / Présentation ── */}
          <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
            <h2 className="mb-4 text-h3 text-ink-900">
              À propos de cette formation
            </h2>
            <div className="space-y-4 text-body leading-6 text-ink-500">
              <p>{formation.description}</p>
            </div>

            {/* Objectifs — "Ce que vous apprendrez" */}
            {formation.objectifs && formation.objectifs.length > 0 && (
              <>
                <h3 className="mt-6 text-h4 font-semibold leading-7 text-ink-900">
                  Ce que vous apprendrez
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {formation.objectifs.map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                      <span className="text-small leading-5 text-ink-500">{obj}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* ── Compétences acquises ── */}
          {formation.competences && formation.competences.length > 0 && (
            <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
              <h2 className="mb-4 text-h3 text-ink-900">
                Compétences acquises
              </h2>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {formation.competences.map((competence) => (
                  <li key={competence} className="flex items-start gap-3">
                    <Star className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-small leading-5 text-ink-500">{competence}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Programme / Modules ── */}
          {modulesAffiches.length > 0 && (
            <div id="programme" className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-h3 text-ink-900">
                  Programme de la formation
                </h2>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-caption font-semibold tracking-wide text-ink-500">
                  {modulesAffiches.length} Module{modulesAffiches.length > 1 ? 's' : ''}
                  {totalLecons > 0 && ` • ${totalLecons} Leçons`}
                </span>
              </div>

              <div className="space-y-4">
                {visibleModules.map((module, index) => {
                  const hasLecons = module.cours.length > 0;
                  const isExpanded = hasLecons && expandedModule === index;

                  /*
                    Un module issu de `programme` n'a pas de leçons : il ne
                    doit donc pas se présenter comme dépliable. On rend un
                    simple bloc, sans bouton ni chevron, plutôt qu'un
                    accordéon qui s'ouvrirait sur du vide.
                  */
                  const contenu = (
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-h4 font-semibold ${
                          isExpanded ? 'bg-sage-200 text-brand-600' : 'bg-brand-100 text-ink-900'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-h5 font-semibold leading-7 text-ink-900">
                          {module.titre}
                        </h4>
                        {hasLecons && (
                          <p className="text-small text-ink-500">
                            {module.cours.length} leçon{module.cours.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  );

                  return (
                    <div
                      key={module.titre}
                      className={`group overflow-hidden rounded-lg border transition-colors ${
                        isExpanded ? 'border-brand-600' : 'border-ink-200'
                      } ${hasLecons ? 'hover:border-brand-600' : ''}`}
                    >
                      {hasLecons ? (
                        <button
                          type="button"
                          onClick={() => toggleModule(index)}
                          aria-expanded={isExpanded}
                          className={`flex w-full items-center justify-between bg-ink-50 p-4 text-left ${
                            isExpanded ? 'border-l-4 border-l-brand-600' : ''
                          }`}
                        >
                          {contenu}
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-brand-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-ink-500 transition-colors group-hover:text-brand-600" />
                          )}
                        </button>
                      ) : (
                        <div className="bg-ink-50 p-4">{contenu}</div>
                      )}

                      {/* Contenu du module — leçons */}
                      {isExpanded && (
                        <div className="space-y-1 border-t border-ink-200 bg-white p-4">
                          {module.cours.map((cours: string) => (
                            <div
                              key={cours}
                              className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-brand-50"
                            >
                              <div className="flex items-center gap-3">
                                <PlayCircle className="h-4 w-4 text-brand-600" />
                                <span className="text-small text-ink-900">{cours}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Show more modules button */}
              {remainingModulesCount > 0 && !showAllModules && (
                <button
                  type="button"
                  onClick={() => setShowAllModules(true)}
                  className="mt-4 w-full rounded-lg border border-transparent py-3 text-small font-semibold text-brand-600 transition-colors hover:border-ink-200 hover:bg-brand-50"
                >
                  Voir les {remainingModulesCount} autre{remainingModulesCount > 1 ? 's' : ''}{' '}
                  module{remainingModulesCount > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}

          {/* ── Débouchés ── */}
          {formation.debouches && formation.debouches.length > 0 && (
            <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
              <h2 className="mb-4 text-h3 text-ink-900">
                Débouchés professionnels
              </h2>
              <ul className="space-y-3">
                {formation.debouches.map((debouche) => (
                  <li key={debouche} className="flex items-start gap-3">
                    <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-small leading-5 text-ink-500">{debouche}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Points forts ── */}
          {formation.objectifs && formation.objectifs.length > 0 && (
            <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
              <h2 className="mb-4 text-h3 text-ink-900">
                Points forts de la formation
              </h2>
              <ul className="space-y-4">
                {formation.objectifs.slice(0, 4).map((objectif, index) => (
                  <li key={objectif} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-small font-bold text-white">
                      {index + 1}
                    </div>
                    <span className="pt-1 text-small leading-5 text-ink-500">{objectif}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ════════ Right / Sidebar ════════ */}
        <div className="col-span-4 space-y-4">
          {/* ── Key Info / Purchase-style card ── */}
          <div className="sticky top-24 rounded-xl border border-ink-100 bg-white p-6">
            {/* Heading */}
            <h3 className="mb-4 text-h4 font-semibold leading-7 text-ink-900">
              Informations clés
            </h3>

            {/* Info list */}
            <ul className="mb-6 space-y-4">
              {/* Niveau */}
              <li className="flex items-center gap-3 text-small text-ink-500">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <GraduationCap className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <div className="text-caption font-semibold tracking-wide text-ink-900">Niveau</div>
                  <div className="font-semibold text-ink-900">{formation.niveau}</div>
                </div>
              </li>

              {/* Durée */}
              <li className="flex items-center gap-3 text-small text-ink-500">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <Clock className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <div className="text-caption font-semibold tracking-wide text-ink-900">Durée</div>
                  <div className="font-semibold text-ink-900">{formation.duree}</div>
                </div>
              </li>

              {/* Domaine */}
              <li className="flex items-center gap-3 text-small text-ink-500">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <BookOpen className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <div className="text-caption font-semibold tracking-wide text-ink-900">Domaine</div>
                  <div className="font-semibold text-ink-900">
                    {Array.isArray(formation.domaine)
                      ? formation.domaine.join(', ')
                      : formation.domaine}
                  </div>
                </div>
              </li>

              {/* Crédits ECTS */}
              {formation.credits && (
                <li className="flex items-center gap-3 text-small text-ink-500">
                  <div>
                    <div className="text-caption font-semibold tracking-wide text-ink-900">
                      Crédits ECTS
                    </div>
                    <div className="font-semibold text-ink-900">{formation.credits} crédits</div>
                  </div>
                </li>
              )}

              {/* Responsable */}
              {formation.responsable && (
                <li className="flex items-center gap-3 text-small text-ink-500">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <User className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-caption font-semibold tracking-wide text-ink-900">
                      Responsable
                    </div>
                    <div className="font-semibold text-ink-900">{formation.responsable}</div>
                  </div>
                </li>
              )}

              {/* Contact email */}
              {formation.email && (
                <li className="flex items-center gap-3 text-small text-ink-500">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <Mail className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-caption font-semibold tracking-wide text-ink-900">
                      Contact
                    </div>
                    <a
                      href={`mailto:${formation.email}`}
                      className="text-small font-medium text-brand-600 transition-colors hover:underline"
                    >
                      {formation.email}
                    </a>
                  </div>
                </li>
              )}
            </ul>

            {/* CTA */}
            {formation.email && (
              <a
                href={`mailto:${formation.email}`}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 py-3 text-small font-semibold text-white transition-colors hover:bg-ink-800"
              >
                <Mail className="h-4 w-4" />
                Contacter la formation
              </a>
            )}

            {/* Conditions d'admission */}
            {formation.conditions && formation.conditions.length > 0 && (
              <div className="mt-6 border-t border-ink-200 pt-6">
                <h4 className="mb-3 flex items-center gap-2 text-small font-semibold text-ink-900">
                  Conditions d'admission
                </h4>
                <ul className="space-y-2">
                  {formation.conditions.map((condition) => (
                    <li key={condition} className="flex items-start gap-2 text-small text-ink-500">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Profil cliquable du responsable (§26) ── */}
          <ResponsableCard
            responsableId={formation.responsableId}
            responsable={formation.responsable}
            email={formation.email}
          />
        </div>
      </section>
    </div>
  );
};

export default FormationDetailContent;