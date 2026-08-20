import { Card, CardContent } from '@/components/compat/mui';
import { Calendar, CircleCheck, FileText } from 'lucide-react';
import React from 'react';
import { GREEN } from '../../constants/colors';
import type { AdmissionTimelineProps } from '../../types/admission.types';

const DEFAULT_STEPS = [
  {
    date: 'Janvier - Mai',
    titre: 'Candidatures en ligne',
    icon: <FileText />,
  },
  {
    date: 'Juin',
    titre: "Examens d'entrée",
    icon: <Calendar />,
  },
  {
    date: 'Juillet',
    titre: 'Résultats et entretiens',
    icon: <CircleCheck />,
  },
  {
    date: 'Septembre',
    titre: 'Rentrée académique',
    icon: <CircleCheck />,
  },
];

const AdmissionTimeline: React.FC<AdmissionTimelineProps> = (
  props: Readonly<AdmissionTimelineProps>
) => {
  const { title = 'Calendrier des admissions 2026', steps = DEFAULT_STEPS } = props;

  return (
    <section className="border-b border-ink-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-h2 text-ink-900">
          {title}
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((etape) => (
            <Card
              key={etape.titre}
            >
              <CardContent className="p-6">
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: GREEN[50] }}
                >
                  {etape.icon}
                </div>

                <div className="mb-1 text-small font-semibold" style={{ color: GREEN[600] }}>
                  {etape.date}
                </div>

                <div className="font-semibold text-ink-900">{etape.titre}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdmissionTimeline;
