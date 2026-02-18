export function parseCultureInvariantFloat(value: null | string | undefined) {
  if (!value || value.trim() === '') return null;

  return Number(value.trim().replace(',', '.'));
}
