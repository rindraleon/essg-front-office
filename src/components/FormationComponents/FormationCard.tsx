import { Briefcase, Clock, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { getImageUrl } from '../../utils/image.utils';
import ViewDetailsButton from '../common/ViewDetailsButton';
import type { FormationCardProps } from '../../types/formations.types';

const FormationCard = ({
  formation,
  detailLinkBase = '/formations',
  applyLink = '/admission',
}: FormationCardProps) => {
  return (
    <article data-gsap className="group overflow-hidden rounded-[1.25rem] border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-card-hover">
      <div className="flex flex-col sm:flex-row">
        {formation.image && (
          <div className="relative w-full shrink-0 overflow-hidden bg-ink-100 sm:w-[40%] sm:self-stretch">
            <div className="aspect-[16/9] w-full sm:aspect-auto sm:h-full">
              <img
                src={getImageUrl(formation.image)}
                alt={formation.titre}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ink-950/25 to-transparent sm:hidden"
            />
          </div>
        )}

        {formation.image && <div aria-hidden="true" className="hidden w-px shrink-0 bg-ink-100 sm:block" />}

        <div className="w-full p-6 sm:w-2/3">
          <div className="mb-4 flex items-start justify-between">
            <Badge>{formation.niveau}</Badge>
            <div className="flex items-center gap-1 text-caption text-ink-500">
              <Clock className="size-3.5" />
              {formation.duree}
            </div>
          </div>

          <h3 className="mb-2 text-h4 font-bold text-ink-900">{formation.titre}</h3>
          <p className="mb-4 text-small font-medium text-brand-600">{formation.domaine.join(', ')}</p>
          <p className="mb-6 leading-relaxed text-ink-500">{formation.description}</p>
          <div className="mb-6 h-px bg-ink-100" />

          <div className="mb-5">
            <div className="mb-3 flex items-center gap-2 text-small font-semibold text-ink-900">
              <GraduationCap className="size-4 text-brand-600" />
              Objectifs principaux
            </div>
            <ul className="space-y-2 text-small text-ink-500">
              {formation.objectifs.slice(0, 3).map((obj) => (
                <li key={obj} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-caption font-bold text-white">
                    ✓
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 text-small font-semibold text-ink-900">
              <Briefcase className="size-4 text-brand-600" />
              Débouchés
            </div>
            <div className="flex flex-wrap gap-2">
              {formation.debouches.slice(0, 3).map((debouche) => (
                <Badge key={debouche}>{debouche}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ViewDetailsButton
              to={`${detailLinkBase}/${formation.slug}`}
              variant="default"
              className="w-full"
              ariaLabel={`Voir le détail de ${formation.titre}`}
            />
            <Link to={applyLink} className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
              Postuler
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FormationCard;
