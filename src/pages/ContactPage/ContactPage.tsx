import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';

import { PageHero, ContactForm, ContactInfoCards, MapEmbed, Breadcrumb } from '@/components';
import type { ContactPageProps } from '@/types';

import { SITE_HERO_IMAGE } from '@/constants';
import { useTitle } from '@/hooks';

const HERO_IMAGE = SITE_HERO_IMAGE;

const UNIV_FIANAR = {
  lat: -21.4413,
  lng: 47.0879,
  label: 'Université de Fianarantsoa — Campus Andrainjato',
  adresse: 'Andrainjato, BP 1264, Fianarantsoa 301, Madagascar',
};

const ContactPage: React.FC<ContactPageProps> = (props: Readonly<ContactPageProps>) => {
  useTitle('Contact | ESSG');

  const {
    pageTitle = 'Contactez-nous',
    pageDescription = 'Notre équipe est à votre disposition pour répondre à toutes vos questions sur les formations, les admissions ou les partenariats.',
    mapLat = UNIV_FIANAR.lat,
    mapLng = UNIV_FIANAR.lng,
    mapLabel = UNIV_FIANAR.label,
    mapAdresse = UNIV_FIANAR.adresse,
  } = props;

  const contactItems = [
    {
      id: 'adresse',
      icon: <MapPin />,
      title: 'Adresse',
      lines: [
        'Université de Fianarantsoa',
        'Campus Andrainjato',
        'BP 1264, Fianarantsoa 301',
        'Madagascar',
      ],
    },
    {
      id: 'telephone',
      icon: <Phone />,
      title: 'Téléphone',
      lines: ['+261 xx xx xxx xx'],
    },
    {
      id: 'email',
      icon: <Mail />,
      title: 'Email',
      lines: ['essg@unif-fianarantsoa.mg'],
    },
    {
      id: 'horaires',
      icon: <Clock />,
      title: 'Horaires',
      lines: ['Lundi - Vendredi : 8h - 17h'],
    },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Contact ESSG"
        title={pageTitle}
        description={pageDescription}
        stats={[
          { value: '< 24h', label: 'Temps de réponse' },
          { value: '5j/7', label: 'Disponibilité' },
          { value: '100%', label: 'Écoute' },
        ]}
      />

      <Breadcrumb items={[{ label: 'Contact' }]} />

      <section className="section-y-tight">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ContactInfoCards items={contactItems} />
            </div>

            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white section-y-tight">
        <div className="section-shell">
          <h2 className="mb-6 text-h3 text-ink-900">Localisation</h2>
          <MapEmbed lat={mapLat} lng={mapLng} label={mapLabel} adresse={mapAdresse} zoom="city" />
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
