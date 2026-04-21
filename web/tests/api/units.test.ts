import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';

import { DELETE, PUT } from '~/app/api/units/[id]/route';
import { GET, POST } from '~/app/api/units/route';
import { idSchema, unitsSchema } from '~/lib/zod';

import { ADMIN_ID, mockUnauthenticated, mockUser, USER_ID } from '../helpers/auth';
import { truncateAll } from '../helpers/db';
import {
  SAMPLE_RECIPE_DATA,
  seedAdmin,
  seedIngredient,
  seedRecipe,
  seedUnit,
} from '../helpers/seed';

afterEach(truncateAll);

describe('GET /api/units', () => {
  it('returns 200 with empty array when no units exist', async () => {
    const res = await GET(new NextRequest('http://localhost/api/units'));

    expect(res.status).toBe(200);

    const data = unitsSchema.parse(await res.json());
    expect(data).toHaveLength(0);
  });

  it('returns seeded units with canBeDeleted field', async () => {
    await seedUnit('Kilogramm', 'kg');

    const res = await GET(new NextRequest('http://localhost/api/units'));

    const [unit] = unitsSchema.parse(await res.json());

    expect(unit?.name).toBe('Kilogramm');
    expect(unit?.canBeDeleted).toBe(true);
  });

  it('returns canBeDeleted false when unit is used by a recipe', async () => {
    const ingredient = await seedIngredient('Tomato');
    if (!ingredient) throw new Error('Failed to seed ingredient');

    const unit = await seedUnit('Kilogramm', 'kg');
    if (!unit) throw new Error('Failed to seed unit');

    await seedRecipe({
      userId: USER_ID,

      data: SAMPLE_RECIPE_DATA,

      categoryIds: [],
      ingredientEntries: [{ ingredientId: ingredient.id, quantity: 1, unitId: unit.id }],
    });

    const res = await GET(new NextRequest('http://localhost/api/units'));
    const [item] = unitsSchema.parse(await res.json());

    expect(item?.canBeDeleted).toBe(false);
  });

  it('filters by query param', async () => {
    await seedUnit('Kilogramm', 'kg');
    await seedUnit('Liter', 'l');

    const res = await GET(new NextRequest('http://localhost/api/units?query=kilogramm'));

    const data = unitsSchema.parse(await res.json());

    expect(data.at(0)?.name).toBe('Kilogramm');
  });
});

describe('POST /api/units', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/units', {
      body: JSON.stringify({ abbreviation: 't', name: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 403 when authenticated but not admin', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/units', {
      body: JSON.stringify({ abbreviation: 't', name: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('returns 201 when admin creates unit', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/units', {
      body: JSON.stringify({ abbreviation: 'kg', name: 'Kilogramm' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(idSchema.safeParse(data.unitId).success).toBe(true);
  });

  it('returns 409 for duplicate name', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);
    await seedUnit('Kilogramm', 'kg');

    const req = new NextRequest('http://localhost/api/units', {
      body: JSON.stringify({ abbreviation: 'kg', name: 'Kilogramm' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it('returns 400 for empty name', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/units', {
      body: JSON.stringify({ abbreviation: 'kg', name: '' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/units/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/units/1', {
      body: JSON.stringify({ abbreviation: 'nn', name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(401);
  });

  it('returns 403 when not admin', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/units/1', {
      body: JSON.stringify({ abbreviation: 'nn', name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(403);
  });

  it('returns 204 when admin updates unit', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const unit = await seedUnit('Old Name', 'on');
    if (!unit) throw new Error('Failed to seed unit');

    const req = new NextRequest(`http://localhost/api/units/${unit.id}`, {
      body: JSON.stringify({ abbreviation: 'nn', name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: String(unit.id) }) });
    expect(res.status).toBe(204);
  });

  it('returns 404 for non-existent unit', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/units/99999', {
      body: JSON.stringify({ abbreviation: 'nn', name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '99999' }) });
    expect(res.status).toBe(404);
  });

  it('returns 409 for duplicate name', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);
    await seedUnit('Existing', 'ex');

    const unit = await seedUnit('To Rename', 'tr');
    if (!unit) throw new Error('Failed to seed unit');

    const req = new NextRequest(`http://localhost/api/units/${unit.id}`, {
      body: JSON.stringify({ abbreviation: 'ex', name: 'Existing' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: String(unit.id) }) });
    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/units/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const res = await DELETE(new NextRequest('http://localhost/'), {
      params: Promise.resolve({ id: '1' }),
    });

    expect(res.status).toBe(401);
  });

  it('returns 403 when not admin', async () => {
    mockUser(USER_ID);

    const res = await DELETE(new NextRequest('http://localhost/', { method: 'DELETE' }), {
      params: Promise.resolve({ id: '1' }),
    });

    expect(res.status).toBe(403);
  });

  it('returns 204 when admin deletes unit', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const unit = await seedUnit('To Delete', 'td');
    if (!unit) throw new Error('Failed to seed unit');

    const res = await DELETE(
      new NextRequest(`http://localhost/api/units/${unit.id}`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: String(unit.id) }) },
    );

    expect(res.status).toBe(204);
  });

  it('returns 404 for non-existent unit', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const res = await DELETE(
      new NextRequest('http://localhost/api/units/99999', { method: 'DELETE' }),
      { params: Promise.resolve({ id: '99999' }) },
    );

    expect(res.status).toBe(404);
  });
});
