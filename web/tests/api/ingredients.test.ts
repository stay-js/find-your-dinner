import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';

import { DELETE, PUT } from '~/app/api/ingredients/[id]/route';
import { GET, POST } from '~/app/api/ingredients/route';
import { idSchema, ingredientsSchema } from '~/lib/zod';

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

describe('GET /api/ingredients', () => {
  it('returns 200 with empty array when no ingredients exist', async () => {
    const res = await GET(new NextRequest('http://localhost/api/ingredients'));

    expect(res.status).toBe(200);

    const data = ingredientsSchema.parse(await res.json());
    expect(data).toHaveLength(0);
  });

  it('returns seeded ingredients with canBeDeleted field', async () => {
    await seedIngredient('Tomato');

    const res = await GET(new NextRequest('http://localhost/api/ingredients'));

    const [ingredient] = ingredientsSchema.parse(await res.json());

    expect(ingredient?.name).toBe('Tomato');
    expect(ingredient?.canBeDeleted).toBe(true);
  });

  it('returns canBeDeleted false when ingredient is used by a recipe', async () => {
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

    const res = await GET(new NextRequest('http://localhost/api/ingredients'));
    const [item] = ingredientsSchema.parse(await res.json());

    expect(item?.canBeDeleted).toBe(false);
  });

  it('filters by query param', async () => {
    await seedIngredient('Tomato');
    await seedIngredient('Potato');

    const res = await GET(new NextRequest('http://localhost/api/ingredients?query=tomato'));

    const data = ingredientsSchema.parse(await res.json());

    expect(data.at(0)?.name).toBe('Tomato');
  });
});

describe('POST /api/ingredients', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/ingredients', {
      body: JSON.stringify({ name: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 403 when authenticated but not admin', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/ingredients', {
      body: JSON.stringify({ name: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('returns 201 when admin creates ingredient', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/ingredients', {
      body: JSON.stringify({ name: 'Tomato' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(idSchema.safeParse(data.ingredientId).success).toBe(true);
  });

  it('returns 409 for duplicate name', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);
    await seedIngredient('Tomato');

    const req = new NextRequest('http://localhost/api/ingredients', {
      body: JSON.stringify({ name: 'Tomato' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it('returns 400 for empty name', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/ingredients', {
      body: JSON.stringify({ name: '' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/ingredients/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/ingredients/1', {
      body: JSON.stringify({ name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(401);
  });

  it('returns 403 when not admin', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/ingredients/1', {
      body: JSON.stringify({ name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(403);
  });

  it('returns 204 when admin updates ingredient', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const ingredient = await seedIngredient('Old Name');
    if (!ingredient) throw new Error('Failed to seed ingredient');

    const req = new NextRequest(`http://localhost/api/ingredients/${ingredient.id}`, {
      body: JSON.stringify({ name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: String(ingredient.id) }) });
    expect(res.status).toBe(204);
  });

  it('returns 404 for non-existent ingredient', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/ingredients/99999', {
      body: JSON.stringify({ name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '99999' }) });
    expect(res.status).toBe(404);
  });

  it('returns 409 for duplicate name', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);
    await seedIngredient('Existing');

    const ingredient = await seedIngredient('To Rename');
    if (!ingredient) throw new Error('Failed to seed ingredient');

    const req = new NextRequest(`http://localhost/api/ingredients/${ingredient.id}`, {
      body: JSON.stringify({ name: 'Existing' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: String(ingredient.id) }) });
    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/ingredients/[id]', () => {
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

  it('returns 204 when admin deletes ingredient', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const ingredient = await seedIngredient('To Delete');
    if (!ingredient) throw new Error('Failed to seed ingredient');

    const res = await DELETE(
      new NextRequest(`http://localhost/api/ingredients/${ingredient.id}`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: String(ingredient.id) }) },
    );

    expect(res.status).toBe(204);
  });

  it('returns 404 for non-existent ingredient', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const res = await DELETE(
      new NextRequest('http://localhost/api/ingredients/99999', { method: 'DELETE' }),
      { params: Promise.resolve({ id: '99999' }) },
    );

    expect(res.status).toBe(404);
  });
});
