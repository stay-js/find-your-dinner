import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';

import { GET, PUT } from '~/app/api/user/default-ingredients/route';
import { defaultIngredientIdsSchema } from '~/lib/zod';

import { mockUnauthenticated, mockUser, USER_ID } from '../../helpers/auth';
import { truncateAll } from '../../helpers/db';
import { seedDefaultIngredients, seedIngredient } from '../../helpers/seed';

afterEach(truncateAll);

describe('GET /api/user/default-ingredients', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns 200 with empty array when user has no default ingredients', async () => {
    mockUser(USER_ID);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = defaultIngredientIdsSchema.parse(await res.json());
    expect(data).toHaveLength(0);
  });

  it('returns ingredient ids for the authenticated user', async () => {
    mockUser(USER_ID);

    const ing1 = await seedIngredient('Tomato');
    const ing2 = await seedIngredient('Onion');
    if (!ing1 || !ing2) throw new Error('Failed to seed ingredients');

    await seedDefaultIngredients(USER_ID, [ing1.id, ing2.id]);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = defaultIngredientIdsSchema.parse(await res.json());

    expect(data).toHaveLength(2);
    expect(data).toContain(ing1.id);
    expect(data).toContain(ing2.id);
  });

  it("returns only the authenticated user's default ingredients", async () => {
    mockUser(USER_ID);

    const ing1 = await seedIngredient('Tomato');
    const ing2 = await seedIngredient('Onion');
    if (!ing1 || !ing2) throw new Error('Failed to seed ingredients');

    await seedDefaultIngredients(USER_ID, [ing1.id]);
    await seedDefaultIngredients('other_user', [ing2.id]);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = defaultIngredientIdsSchema.parse(await res.json());

    expect(data).toHaveLength(1);
    expect(data).toContain(ing1.id);
    expect(data).not.toContain(ing2.id);
  });
});

describe('PUT /api/user/default-ingredients', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/user/default-ingredients', {
      body: JSON.stringify({ ingredientIds: [] }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid body', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/default-ingredients', {
      body: JSON.stringify({ ingredientIds: 'not-an-array' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative ingredient ids', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/default-ingredients', {
      body: JSON.stringify({ ingredientIds: [-1] }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for non-integer ingredient ids', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/default-ingredients', {
      body: JSON.stringify({ ingredientIds: [1.5] }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 and sets default ingredients', async () => {
    mockUser(USER_ID);

    const ing1 = await seedIngredient('Tomato');
    const ing2 = await seedIngredient('Onion');
    if (!ing1 || !ing2) throw new Error('Failed to seed ingredients');

    const req = new NextRequest('http://localhost/api/user/default-ingredients', {
      body: JSON.stringify({ ingredientIds: [ing1.id, ing2.id] }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const putRes = await PUT(req);
    expect(putRes.status).toBe(200);

    const getRes = await GET();
    expect(getRes.status).toBe(200);

    const data = defaultIngredientIdsSchema.parse(await getRes.json());

    expect(data).toHaveLength(2);
    expect(data).toContain(ing1.id);
    expect(data).toContain(ing2.id);
  });

  it('returns 200 and clears default ingredients when empty array is provided', async () => {
    mockUser(USER_ID);

    const ingredient = await seedIngredient('Tomato');
    if (!ingredient) throw new Error('Failed to seed ingredient');

    await seedDefaultIngredients(USER_ID, [ingredient.id]);

    const req = new NextRequest('http://localhost/api/user/default-ingredients', {
      body: JSON.stringify({ ingredientIds: [] }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const putRes = await PUT(req);
    expect(putRes.status).toBe(200);

    const getRes = await GET();
    expect(getRes.status).toBe(200);

    const data = defaultIngredientIdsSchema.parse(await getRes.json());
    expect(data).toHaveLength(0);
  });

  it('returns 200 and replaces existing default ingredients', async () => {
    mockUser(USER_ID);

    const ing1 = await seedIngredient('Tomato');
    const ing2 = await seedIngredient('Onion');
    if (!ing1 || !ing2) throw new Error('Failed to seed ingredients');

    await seedDefaultIngredients(USER_ID, [ing1.id]);

    const req = new NextRequest('http://localhost/api/user/default-ingredients', {
      body: JSON.stringify({ ingredientIds: [ing2.id] }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const putRes = await PUT(req);
    expect(putRes.status).toBe(200);

    const getRes = await GET();
    expect(getRes.status).toBe(200);

    const data = defaultIngredientIdsSchema.parse(await getRes.json());

    expect(data).toHaveLength(1);
    expect(data).toContain(ing2.id);
    expect(data).not.toContain(ing1.id);
  });
});
