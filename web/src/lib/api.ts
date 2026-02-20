import { type ZodType } from 'zod';

class ApiError extends Error {
  constructor(
    public method: string,
    public url: string,
    public status: number,
  ) {
    super(`API ${method} request to ${url} failed with status ${status}`);
    this.name = 'ApiError';
  }
}

export function DELETE<T>(url: string, schema?: ZodType<T>) {
  return request(url, { method: 'DELETE' }, schema);
}

export function GET<T>(url: string, schema: ZodType<T>) {
  return request(url, undefined, schema);
}

export function POST<T>(url: string, body?: unknown, schema?: ZodType<T>) {
  return request(
    url,
    {
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    },
    schema,
  );
}

export function PUT<T>(url: string, body?: unknown, schema?: ZodType<T>) {
  return request(
    url,
    {
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    },
    schema,
  );
}

async function request<T>(
  url: string,
  options?: RequestInit,
  schema?: ZodType<T>,
): Promise<null | T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new ApiError(options?.method ?? 'GET', url, res.status);
  }

  if (res.status === 204) return null;

  const json = await res.json();

  return schema ? schema.parse(json) : json;
}
