export function buildQueryString(values: { name: string; value: string }[]) {
  const params = new URLSearchParams();

  values.forEach(({ name, value }) => params.set(name, value));

  return params.toString();
}
