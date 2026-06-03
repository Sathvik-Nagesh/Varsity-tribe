export function safeDivide(a: number | undefined | null, b: number | undefined | null): number {
  if (
    a === undefined ||
    a === null ||
    Number.isNaN(a) ||
    b === undefined ||
    b === null ||
    Number.isNaN(b) ||
    b === 0
  ) {
    return 0;
  }

  const result = a / b;
  return Number.isFinite(result) ? result : 0;
}
