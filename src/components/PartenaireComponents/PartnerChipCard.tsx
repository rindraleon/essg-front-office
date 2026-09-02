import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@/utils';
import type { PartenaireItem } from '@/types';

interface PartnerChipCardProps {
  partenaire: PartenaireItem;
}

const PartnerChipCard: React.FC<PartnerChipCardProps> = ({ partenaire }) => {
  const navigate = useNavigate();
  const logoUrl = partenaire.logo ? getImageUrl(partenaire.logo) : null;
  const initiales = partenaire.nom.slice(0, 2).toUpperCase();

  const ouvrirFiche = () => {
    navigate(`/partenaires/${partenaire.slug || partenaire.id}`);
  };

  return (
    <button
      type="button"
      onClick={ouvrirFiche}
      aria-label={`Voir la fiche de ${partenaire.nom}`}
      className=" group flex w-[17rem] shrink-0 items-center gap-3.5
        rounded-2xl border border-ink-100 bg-white px-4 py-3.5 text-left
        shadow-[0_1px_2px_rgb(15_33_30/0.04),0_4px_14px_-6px_rgb(15_33_30/0.10)]
        transition-[transform,box-shadow,border-color] duration-(--duration-hover) ease-out
        hover:border-brand-200
        hover:shadow-[0_2px_4px_rgb(15_33_30/0.05),0_14px_30px_-12px_rgb(15_33_30/0.20)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
        motion-reduce:transition-none
        sm:w-[19rem]
      "
    >
      <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-ink-100 bg-white p-1.5">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className=" max-h-full max-w-full object-contain
              transition-transform duration-(--duration-hover) ease-out
              group-hover:scale-[1.04] group-focus-visible:scale-[1.04]
              motion-reduce:transition-none motion-reduce:group-hover:scale-100
            "
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-small font-bold text-brand-600">{initiales}</span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-h4 text-ink-900 transition-colors duration-(--duration-quick) group-hover:text-brand-700 motion-reduce:transition-none">
          {partenaire.nom}
        </span>
        {(partenaire.secteur || partenaire.type) && (
          <span className="mt-0.5 block truncate text-small text-ink-500">
            {partenaire.secteur || partenaire.type}
          </span>
        )}
      </span>
    </button>
  );
};

export default PartnerChipCard;
