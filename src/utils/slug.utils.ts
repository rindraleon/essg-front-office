export const generateSlug = (text: string): string => {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');
  return normalized.split('-').filter(Boolean).join('-');
};

export const toUpperName = (value: string): string => {
  return value.toLocaleUpperCase('fr-FR');
};

export const toCapitalizedWords = (value: string): string =>
  value
    .toLocaleLowerCase('fr-FR')
    .replace(
      /(^|[\s'’-])(\p{L})/gu,
      (_, separator, letter) => `${separator}${letter.toLocaleUpperCase('fr-FR')}`
    );
