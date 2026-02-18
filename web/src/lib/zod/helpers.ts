export function isIntegerString(val: string) {
  if (!val || val === '') return false;

  return Number.isInteger(Number(val));
}

export function isPositiveIntegerString(val: string) {
  if (!val || val === '') return false;

  const num = Number(val);
  return Number.isInteger(num) && num > 0;
}

export function parseCultureInvariantFloat(value: null | string | undefined) {
  if (!value || value.trim() === '') return null;

  return Number(value.trim().replace(',', '.'));
}
