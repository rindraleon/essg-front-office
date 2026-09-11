import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Handshake, Rocket, Users } from 'lucide-react';
import React from 'react';

type HonestEmptyVariant =
  'formations' | 'actualites' | 'partenaires' | 'projets' | 'ressourcesHumaines' | 'generique';

const CONFIG: Record<
  HonestEmptyVariant,
  { icon: React.ReactNode; title: string; description: string; ctaLabel: string; ctaLink: string }
> = {
  formations: {
    icon: <BookOpen className="size-6 text-brand-700" />,
    title: 'Le catalogue arrive très bientôt',
    description:
      'Les parcours Licence & Master des 3 axes sont en cours de publication. Interrogé ? Contactez directement notre équipe admission.',
    ctaLabel: "Contacter l'admission",
    ctaLink: '/contact',
  },
  actualites: {
    icon: <Calendar className="size-6 text-brand-700" />,
    title: 'Les actualités arrivent très bientôt',
    description:
      "L'équipe ESSG prépare ses premières publications. Revenez prochainement ou contactez-nous pour toute question.",
    ctaLabel: 'Nous contacter',
    ctaLink: '/contact',
  },
  partenaires: {
    icon: <Handshake className="size-6 text-brand-700" />,
    title: 'Le réseau s’étoffe',
    description:
      'Nos partenariats institutionnels et entreprises seront publiés prochainement. Intéressé par un partenariat ? Écrivons ensemble.',
    ctaLabel: 'Proposer un partenariat',
    ctaLink: '/contact',
  },
  projets: {
    icon: <Rocket className="size-6 text-brand-700" />,
    title: 'Les projets arrivent',
    description:
      'Les travaux de terrain, de recherche et d’innovation géospatiale seront présentés ici très prochainement.',
    ctaLabel: 'Nous contacter',
    ctaLink: '/contact',
  },
  ressourcesHumaines: {
    icon: <Users className="size-6 text-brand-700" />,
    title: 'L’équipe se dévoile bientôt',
    description:
      'Les enseignants, chercheurs et personnels de l’ESSG seront présentés ici. Besoin d’informations ? Contactez la scolarité.',
    ctaLabel: 'Contacter la scolarité',
    ctaLink: '/contact',
  },
  generique: {
    icon: <BookOpen className="size-6 text-brand-700" />,
    title: 'Contenu à venir',
    description: 'Cette rubrique sera alimentée prochainement. Revenez bientôt ou contactez-nous.',
    ctaLabel: 'Nous contacter',
    ctaLink: '/contact',
  },
};

const HonestEmptyState: React.FC<{ variant?: HonestEmptyVariant; className?: string }> = ({
  variant = 'generique',
  className,
}) => {
  const cfg = CONFIG[variant];
  return (
    <div
      className={`mx-auto max-w-2xl rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/60 p-8 text-center shadow-sm ${className ?? ''}`}
    >
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-brand-100 text-brand-700">
        {cfg.icon}
      </div>
      <h3 className="text-h4 font-bold text-ink-900">{cfg.title}</h3>
      <p className="mx-auto mt-2 max-w-md text-body text-ink-600">{cfg.description}</p>
      <Link
        to={cfg.ctaLink}
        className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-5 py-2.5 text-small font-semibold text-white shadow-sm transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
      >
        {cfg.ctaLabel}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
};

export default HonestEmptyState;
