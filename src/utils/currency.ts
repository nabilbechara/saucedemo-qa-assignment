export function parseCurrency(text: string): number {
  const match = text.match(/-?\d+(\.\d+)?/);
  if (!match) {
    throw new Error(`Unable to parse a numeric value from "${text}"`);
  }
  return Number(match[0]);
}
