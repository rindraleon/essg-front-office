export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}
