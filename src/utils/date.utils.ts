const TIMEZONE = 'Indian/Antananarivo';
const LOCALE = 'fr-FR';
const MOIS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];
export type DateInput = string | Date | number | null | undefined;
function parseDate(input: DateInput): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}
export function formatDateCourt(input: DateInput): string {
  const d = parseDate(input);
  if (!d) return '—';
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}
export function formatDateLong(input: DateInput): string {
  const d = parseDate(input);
  if (!d) return '—';
  const day = new Intl.DateTimeFormat(LOCALE, { timeZone: TIMEZONE, day: 'numeric' }).format(d);
  const monthIndex = parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, month: 'numeric' }).format(d),
    10
  );
  const year = new Intl.DateTimeFormat(LOCALE, { timeZone: TIMEZONE, year: 'numeric' }).format(d);
  return `${day} ${MOIS_FR[monthIndex - 1] || ''} ${year}`;
}
export const formatDate = (date: string): string => formatDateLong(date);
export function formatDateTimeCourt(input: DateInput): string {
  const d = parseDate(input);
  if (!d) return '—';
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
export function formatDateTimeLong(input: DateInput): string {
  const d = parseDate(input);
  if (!d) return '—';
  return `${formatDateLong(d)} à ${new Intl.DateTimeFormat(LOCALE, { timeZone: TIMEZONE, hour: '2-digit', minute: '2-digit' }).format(d)}`;
}
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  const date = parseDate(dateString);
  if (!date) return '—';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return 'à l’instant';
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return 'à l’instant';
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const days = Math.floor(h / 24);
  if (days === 1) return 'hier';
  if (days < 30) return `il y a ${days} j`;
  return formatDateLong(dateString);
}
