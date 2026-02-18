import { NextResponse } from 'next/server';

export function forbidden(json: Record<string, unknown> = {}) {
  return NextResponse.json({ message: 'Forbidden', ...json }, { status: 403 });
}

export function unauthorized(json: Record<string, unknown> = {}) {
  return NextResponse.json({ message: 'Unauthorized', ...json }, { status: 401 });
}
