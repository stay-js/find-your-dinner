import type { ZodType } from 'zod';

export async function DELETE(url: string) {
  const res = await fetch(url, { method: 'DELETE' });

  if (!res.ok) {
    throw new Error(`API DELETE request to ${url} failed with status ${res.status}`);
  }

  return null;
}

export async function GET<T>(url: string, schema: ZodType<T>) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API GET request to ${url} failed with status ${res.status}`);
  }

  const json = await res.json();

  return schema.parse(json);
}

export async function POST(url: string, body?: unknown) {
  const res = await fetch(url, {
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(`API POST request to ${url} failed with status ${res.status}`);
  }

  return null;
}

export async function PUT(url: string, body?: unknown) {
  const res = await fetch(url, {
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  });

  if (!res.ok) {
    throw new Error(`API PUT request to ${url} failed with status ${res.status}`);
  }

  return null;
}
