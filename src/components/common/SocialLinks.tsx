import React, { useEffect, useState } from 'react';
import { cn } from '@/lib';

interface SocialLinksProps {
  className?: string;
  size?: number;
  fixed?: boolean;
}

const SOCIAL_ITEMS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61588935937597',
    label: 'Facebook ESSG',
    color: '#1877F2',
    icon: (size: number) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="transition-transform duration-300 group-hover:scale-125"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/essg',
    label: 'LinkedIn ESSG',
    color: '#0A66C2',
    icon: (size: number) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="transition-transform duration-300 group-hover:scale-125"
      >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:essg@univ-fianarantsoa.mg',
    label: 'Email essg@univ-fianarantsoa.mg',
    color: '#EA4335',
    icon: (size: number) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="transition-transform duration-300 group-hover:scale-125"
      >
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/261381828249',
    label: 'WhatsApp ESSG',
    color: '#25D366',
    icon: (size: number) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="transition-transform duration-300 group-hover:scale-125"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
];

const SocialLinks: React.FC<SocialLinksProps> = ({
  className,
  size = 22,
  fixed = false,
}) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (!fixed) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      setIsScrolling(true);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [fixed]);

  const scrollingClasses = isScrolling
    ? 'pointer-events-none translate-x-6 opacity-0'
    : 'pointer-events-auto translate-x-0 opacity-100';

  const containerClasses = fixed
    ? cn(
        'fixed right-4 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4',
        'transition-[opacity,transform] duration-300 ease-out',
        scrollingClasses
      )
    : 'flex items-center gap-4';

  return (
    <aside
      aria-label="Réseaux sociaux"
      className={cn(containerClasses, className)}
    >
      {SOCIAL_ITEMS.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={item.label}
          style={{ color: item.color }}
          className={cn(
            'group relative flex items-center justify-center p-1.5 transition-all duration-300',
            'hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-full',
            'drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
          )}
        >
          {item.icon(size)}
          {/* Tooltip on hover */}
          <span className="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-lg bg-ink-950/90 px-2.5 py-1 text-[0.65rem] font-bold text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
            {item.name}
          </span>
        </a>
      ))}
    </aside>
  );
};

export default SocialLinks;
