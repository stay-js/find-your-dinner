import type { ZodType } from 'zod';

export async function get<T>(url: string, schema: ZodType<T>) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API GET request to ${url} failed with status ${res.status}`);
  }

  const json = await res.json();

  return schema.parse(json);
}

export async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API POST request to ${url} failed with status ${res.status}`);
  }

  const json = await res.json();

  return json;
}
