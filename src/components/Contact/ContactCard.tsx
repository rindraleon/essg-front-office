import { Card, CardContent } from '../compat/mui';
import { ArrowRight, CircleHelp } from 'lucide-react';
import React from 'react';
import Button from '../compat/button';
import { Link as RouterLink } from 'react-router-dom';
import { GREEN } from '@/constants';
import type { ContactCardProps } from '@/types';

const ContactCard: React.FC<ContactCardProps> = (props: Readonly<ContactCardProps>) => {
  const {
    icon,
    title = 'Vous ne trouvez pas la réponse à votre question ?',
    description = "Notre équipe est disponible pour répondre à toutes vos interrogations. N'hésitez pas à nous contacter.",
    primaryLabel = "Contacter l'ESSG",
    primaryLink = '/contact',
    secondaryLabel = 'Postuler maintenant',
    secondaryLink = '/admission',
  } = props;

  return (
    <Card className="group transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-card-hover">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: GREEN[100] }}
          >
            {icon ?? <CircleHelp className="text-brand-700" />}
          </div>

          <div className="flex-1">
            <h3 className="mb-2 text-lg font-bold text-ink-900 group-hover:text-brand-700 transition-colors">{title}</h3>

            <p className="mb-5 leading-relaxed text-justify text-ink-600">{description}</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                component={RouterLink}
                to={primaryLink}
                variant="contained"
                endIcon={<ArrowRight className="size-4" />}
                className="transition-transform duration-200 hover:scale-[1.02]"
              >
                {primaryLabel}
              </Button>

              <Button
                component={RouterLink}
                to={secondaryLink}
                variant="outlined"
                className="transition-transform duration-200 hover:scale-[1.02]"
              >
                {secondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
