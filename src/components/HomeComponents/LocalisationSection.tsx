import { Facebook, Globe, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import Button from '../compat/button';
import { Link as RouterLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useGsapReveal from '@/hooks/useGsapReveal';
import type { LocalisationSectionProps } from '@/types';
import SectionHeader from '../common/SectionHeader';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocalisationSection: React.FC<LocalisationSectionProps> = (
  props: Readonly<LocalisationSectionProps>
) => {
  const {
    addressLabel = 'Adresse physique & Campus',
    address = 'ESSG e-atiala Andrainjato, Université de Fianarantsoa, Madagascar',
    phone = '+261 38 18 282 49',
    email = 'essg@univ-fianarantsoa.mg',
    latitude = -21.462997,
    longitude = 47.107401,
  } = props;

  const revealRef = useGsapReveal<HTMLElement>();

  return (
    <section
      ref={revealRef}
      className="relative overflow-hidden bg-gradient-to-b from-ink-50/50 via-white to-brand-50/30 section-y"
    >
      <div className="section-shell">
        <SectionHeader
          eyebrow="Contact & Accès"
          title = 'Restons en contact'
          description = 'Pour toute information concernant nos formations, les admissions ou la vie académique de l’ESSG, notre équipe reste à votre disposition.'
        />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div data-gsap className="space-y-6">
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-4.5 shadow-sm transition-all duration-300 hover:border-brand-300 hover:shadow-card">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-small font-bold text-ink-900">{addressLabel}</h3>
                  <p className="mt-0.5 text-caption text-ink-600">{address}</p>
                  <span className="mt-1 inline-block font-tech text-[0.65rem] text-brand-700">
                    21.4630° S · 47.1074° E · Alt. 1 200 m
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-4.5 shadow-sm transition-all duration-300 hover:border-brand-300 hover:shadow-card">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-800">
                  <Globe className="size-5 text-brand-700" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-small font-bold text-ink-900">Coordonnées directes</h3>
                  <div className="flex flex-col gap-1.5 text-caption text-ink-600">
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 hover:text-brand-700 transition-colors"
                    >
                      <Phone className="size-3.5 text-brand-600" />
                      <span>{phone}</span>
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 hover:text-brand-700 transition-colors"
                    >
                      <Mail className="size-3.5 text-brand-600" />
                      <span>{email}</span>
                    </a>
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-brand-700 transition-colors"
                    >
                      <Facebook className="size-3.5 text-brand-600" />
                      <span>École Supérieure des Sciences Géomatiques — ESSG</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                component={RouterLink}
                to="/contact"
                variant="contained"
                className="bg-brand-700 hover:bg-brand-800"
              >
                Envoyer un message
              </Button>
              <div className="text-caption font-semibold text-brand-800">
                ESSG — Université de Fianarantsoa · <em>Formez les experts de demain !</em>
              </div>
            </div>
          </div>

          <div
            data-gsap
            className="relative aspect-video overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-elevated lg:h-[360px] lg:aspect-auto"
          >
            <div className="absolute right-4 top-4 z-10 rounded-xl border border-ink-200/80 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md">
              <span className="flex items-center gap-1.5 font-tech text-[0.65rem] font-bold text-brand-900">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                CAMPUS ANDRAINJATO
              </span>
            </div>
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              scrollWheelZoom={false}
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitude, longitude]}>
                <Popup>
                  <div className="text-center p-1 font-sans">
                    <strong className="block text-brand-900 font-bold">ESSG - École Supérieure de Sciences Géomatiques</strong>
                    <span className="text-xs text-ink-600">Université de Fianarantsoa</span>
                    <br />
                    <span className="text-[11px] text-ink-500">Andrainjato, Madagascar</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalisationSection;
