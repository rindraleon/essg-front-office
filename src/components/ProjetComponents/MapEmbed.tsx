import { Fade, IconButton, Tooltip } from '@/components/compat/mui';
import { ExternalLink, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { GREEN } from '../../constants/colors';
import type { MapEmbedProps } from '../../types/projets.types';

const ZOOM_DELTAS: Record<string, number> = {
  close: 0.01,
  city: 0.04,
  region: 0.15,
};

const MapEmbed: React.FC<MapEmbedProps> = (props: Readonly<MapEmbedProps>) => {
  const { lat, lng, label, adresse, zoom = 'city', height = 400 } = props;

  const [isHovered, setIsHovered] = useState(false);

  const delta = ZOOM_DELTAS[zoom] ?? ZOOM_DELTAS.city;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;

  return (
    <div className="w-full">
      {/* {adresse && (
                <p className="mb-3 flex items-center justify-center gap-1.5 text-center text-caption text-ink-500">
                    <MapPin />
                    {adresse}
                </p>
            )} */}

      <div
        className="relative overflow-hidden rounded-2xl border border-ink-100 shadow-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Barre d'en-tête */}
        <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50/60 px-3 py-2.5">
          <MapPin />
          <span className="truncate text-caption font-medium text-ink-700">{label}</span>

          <Tooltip title="Ouvrir dans OpenStreetMap">
            <IconButton
              component="a"
              href={osmLink}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              <ExternalLink />
            </IconButton>
          </Tooltip>
        </div>

        {/* Carte */}
        <div className="relative">
          <iframe
            title={label}
            src={src}
            width="100%"
            height={height}
            className="block border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Tooltip au survol */}
          <Fade in={isHovered} timeout={300}>
            <div
              className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-start gap-3 rounded-xl p-4 text-center shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: `1px solid ${GREEN[200]}`,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: GREEN[50] }}
              >
                <MapPin />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-small font-semibold" style={{ color: GREEN[800] }}>
                  {label}
                </p>

                {adresse && <p className="mt-0.5 text-caption text-ink-500">{adresse}</p>}

                <p className="mt-1 text-caption text-ink-400">
                  {lat.toFixed(4)}°S, {lng.toFixed(4)}°E
                </p>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default MapEmbed;
