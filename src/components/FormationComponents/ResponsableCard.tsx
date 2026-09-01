import { ArrowRight, Mail, User } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useActiveRessourcesHumaines } from '@/hooks';
import { getImageUrl, formatFullName } from '@/utils';
import type { RessourceHumaine } from '@/types';

interface ResponsableCardProps {
  responsableId?: number | null;
  responsable?: string;
  email?: string;
}

function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .sort((a, b) => a.localeCompare(b))
    .join(' ');
}

const ResponsableCard = ({ responsableId, responsable, email }: ResponsableCardProps) => {
  const { ressourcesHumaines, loading } = useActiveRessourcesHumaines();

  const profil: RessourceHumaine | undefined = useMemo(() => {
    if (responsableId) {
      const byId = ressourcesHumaines.find((item) => item.id === responsableId);
      if (byId) return byId;
    }
    if (responsable) {
      const needle = normalizeName(responsable);
      return ressourcesHumaines.find((item) => normalizeName(formatFullName(item)) === needle);
    }
    return undefined;
  }, [ressourcesHumaines, responsableId, responsable]);

  const displayName = profil ? formatFullName(profil) : responsable;
  if (!displayName) return null;

  const photoUrl = profil?.photo ? getImageUrl(profil.photo) : null;
  const contactEmail = profil?.email || email;

  const content = (
    <div className="flex items-center gap-4">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={displayName}
          loading="lazy"
          decoding="async"
          className="size-16 shrink-0 rounded-full border-2 border-brand-100 object-cover"
        />
      ) : (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-brand-100 bg-brand-50">
          <User className="size-8 text-brand-700" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-body font-semibold text-ink-900">{displayName}</h4>

        {profil?.poste && <p className="truncate text-small text-ink-600">{profil.poste}</p>}

        {contactEmail && (
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-small text-brand-700">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{contactEmail}</span>
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-h4 font-semibold text-ink-900">Responsable de formation</h3>

      {loading && !profil ? (
        <div className="flex items-center gap-4">
          <div className="skeleton-shimmer size-16 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-shimmer h-4 w-40 rounded" />
            <div className="skeleton-shimmer h-3 w-28 rounded" />
          </div>
        </div>
      ) : (
        content
      )}

      {profil && (
        <Link
          to={`/ressources-humaines/${profil.slug ?? profil.id}`}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-small font-medium text-brand-700 transition-colors duration-(--duration-quick) hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Voir le profil
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
};

export default ResponsableCard;
