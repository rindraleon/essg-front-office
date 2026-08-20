import { Clock, Contact, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';


import PageHero from '../../components/common/PageHero';
import type { ContactPageProps } from '../../types/contact.types';
import { ContactForm, ContactInfoCards, MapEmbed, Breadcrumb, CtaSection } from '../../components';

import { SITE_HERO_IMAGE } from '../../constants/media';
import { useTitle } from '@/hooks/useTitle';

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
      lines: ['+261 34 28 085 30', '+261 33 12 345 67'],
    },
    {
      id: 'email',
      icon: <Mail />,
      title: 'Email',
      lines: ['contact@essg.mg', 'admission@essg.mg'],
    },
    {
      id: 'horaires',
      icon: <Clock />,
      title: 'Horaires',
      lines: ['Lundi - Vendredi : 8h - 17h', 'Samedi : 9h - 13h', 'Dimanche : Fermé'],
    },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Les toasts sont gérés globalement par <AppToaster /> (App.tsx). */}

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

      {/* Formulaire et Infos */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      {/* Carte */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-h3 text-ink-900">Localisation</h2>
          <MapEmbed lat={mapLat} lng={mapLng} label={mapLabel} adresse={mapAdresse} zoom="city" />
        </div>
      </section>

      <CtaSection
        icon={<Contact />}
        title="Un projet, une question ?"
        description="Notre équipe vous répond dans les plus brefs délais. Contactez-nous ou découvrez nos formations."
        primaryLabel="Voir les formations"
        primaryLink="/formations"
        secondaryLabel="Questions fréquentes"
        secondaryLink="/faq"
      />
    </div>
  );
};

export default ContactPage;
