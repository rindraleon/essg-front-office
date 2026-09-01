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
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import ResponsableCard from './ResponsableCard';
import type { FormationDetailContentProps } from '@/types';

const FormationDetailContent: React.FC<FormationDetailContentProps> = (
  props: Readonly<FormationDetailContentProps>
) => {
  const { formation } = props;
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [showAllModules, setShowAllModules] = useState(false);

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

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

  const totalLecons = modulesAffiches.reduce((total, module) => total + module.cours.length, 0);

  return (
    <div className="bg-transparent text-ink-900 antialiased">
      <section className="mx-auto grid max-w-[1280px] grid-cols-4 gap-6 px-4 section-y-tight md:grid-cols-12 md:px-8">
        <div className="col-span-4 space-y-8 md:col-span-8">
          <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
            <h2 className="mb-4 text-h3 text-ink-900">À propos de cette formation</h2>
            <div className="space-y-4 text-body leading-6 text-ink-500">
              <p>{formation.description}</p>
            </div>

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

          {formation.competences && formation.competences.length > 0 && (
            <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
              <h2 className="mb-4 text-h3 text-ink-900">Compétences acquises</h2>
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

          {modulesAffiches.length > 0 && (
            <div id="programme" className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-h3 text-ink-900">Programme de la formation</h2>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-caption font-semibold tracking-wide text-ink-500">
                  {modulesAffiches.length} Module{modulesAffiches.length > 1 ? 's' : ''}
                  {totalLecons > 0 && ` • ${totalLecons} Leçons`}
                </span>
              </div>

              <div className="space-y-4">
                {visibleModules.map((module, index) => {
                  const hasLecons = module.cours.length > 0;
                  const isExpanded = hasLecons && expandedModule === index;

                  const contenu = (
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-h4 font-semibold ${
                          isExpanded ? 'bg-brand-200 text-brand-600' : 'bg-brand-100 text-ink-900'
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

          {formation.debouches && formation.debouches.length > 0 && (
            <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
              <h2 className="mb-4 text-h3 text-ink-900">Débouchés professionnels</h2>
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

          {formation.objectifs && formation.objectifs.length > 0 && (
            <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
              <h2 className="mb-4 text-h3 text-ink-900">Points forts de la formation</h2>
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

        <div className="col-span-4 space-y-4">
          <div className="sticky top-24 rounded-xl border border-ink-100 bg-white p-6">
            <h3 className="mb-4 text-h4 font-semibold leading-7 text-ink-900">Informations clés</h3>

            <ul className="mb-6 space-y-4">
              <li className="flex items-center gap-3 text-small text-ink-500">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <GraduationCap className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <div className="text-caption font-semibold tracking-wide text-ink-900">
                    Niveau
                  </div>
                  <div className="font-semibold text-ink-900">{formation.niveau}</div>
                </div>
              </li>

              <li className="flex items-center gap-3 text-small text-ink-500">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <Clock className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <div className="text-caption font-semibold tracking-wide text-ink-900">Durée</div>
                  <div className="font-semibold text-ink-900">{formation.duree}</div>
                </div>
              </li>

              <li className="flex items-center gap-3 text-small text-ink-500">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <BookOpen className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <div className="text-caption font-semibold tracking-wide text-ink-900">
                    Domaine
                  </div>
                  <div className="font-semibold text-ink-900">
                    {Array.isArray(formation.domaine)
                      ? formation.domaine.join(', ')
                      : formation.domaine}
                  </div>
                </div>
              </li>

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

            {formation.email && (
              <a
                href={`mailto:${formation.email}`}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 py-3 text-small font-semibold text-white transition-colors hover:bg-ink-800"
              >
                <Mail className="h-4 w-4" />
                Contacter la formation
              </a>
            )}

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
