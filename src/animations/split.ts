export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function splitLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
