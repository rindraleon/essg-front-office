import { Card, CardContent } from '@/components/compat/mui';
import { ArrowRight, CircleHelp } from 'lucide-react';
import React from 'react';
import Button from '@/components/compat/button';
import { Link as RouterLink } from 'react-router-dom';
import { GREEN } from '../../constants/colors';
import type { ContactCardProps } from '../../types/faq.types';

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
    <Card
    >
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: GREEN[100] }}
          >
            {icon ?? <CircleHelp />}
          </div>

          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-ink-900">{title}</h3>

            <p className="mb-5 leading-6 text-ink-500">{description}</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                component={RouterLink}
                to={primaryLink}
                variant="contained"
                endIcon={<ArrowRight className="size-4" />}
              >
                {primaryLabel}
              </Button>

              <Button
                component={RouterLink}
                to={secondaryLink}
                variant="outlined"
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
