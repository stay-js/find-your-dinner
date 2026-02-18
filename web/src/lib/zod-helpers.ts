export function isIntegerString(val: string) {
  if (!val || val === '') return false;

  return Number.isInteger(Number(val));
}

export function isPositiveIntegerString(val: string) {
  if (!val || val === '') return false;

  const num = Number(val);
  return Number.isInteger(num) && num > 0;
}
