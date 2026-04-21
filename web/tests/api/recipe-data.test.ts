import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';

import { POST } from '~/app/api/recipe-data/[id]/verify/route';

import { ADMIN_ID, mockUnauthenticated, mockUser, USER_ID } from '../helpers/auth';
import { truncateAll } from '../helpers/db';
import {
  SAMPLE_RECIPE_DATA,
  seedAdmin,
  seedRecipe,
  UNVERIFIED_SAMPLE_RECIPE_DATA,
} from '../helpers/seed';

afterEach(truncateAll);

describe('POST /api/recipe-data/[id]/verify', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const res = await POST(
      new NextRequest('http://localhost/api/recipe-data/1/verify', { method: 'POST' }),
      {
        params: Promise.resolve({ id: '1' }),
      },
    );

    expect(res.status).toBe(401);
  });

  it('returns 403 when authenticated but not admin', async () => {
    mockUser(USER_ID);

    const res = await POST(
      new NextRequest('http://localhost/api/recipe-data/1/verify', { method: 'POST' }),
      {
        params: Promise.resolve({ id: '1' }),
      },
    );

    expect(res.status).toBe(403);
  });

  it('returns 400 for invalid id', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const res = await POST(
      new NextRequest('http://localhost/api/recipe-data/not-a-number/verify', { method: 'POST' }),
      { params: Promise.resolve({ id: 'not-a-number' }) },
    );

    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent recipe data', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const res = await POST(
      new NextRequest('http://localhost/api/recipe-data/99999/verify', { method: 'POST' }),
      { params: Promise.resolve({ id: '99999' }) },
    );

    expect(res.status).toBe(404);
  });

  it('returns 409 when recipe data is already verified', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const { recipeData } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await POST(
      new NextRequest(`http://localhost/api/recipe-data/${recipeData.id}/verify`, {
        method: 'POST',
      }),
      { params: Promise.resolve({ id: String(recipeData.id) }) },
    );

    expect(res.status).toBe(409);
  });

  it('returns 204 when admin verifies unverified recipe data', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const { recipeData } = await seedRecipe({
      categoryIds: [],
      data: UNVERIFIED_SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await POST(
      new NextRequest(`http://localhost/api/recipe-data/${recipeData.id}/verify`, {
        method: 'POST',
      }),
      { params: Promise.resolve({ id: String(recipeData.id) }) },
    );

    expect(res.status).toBe(204);
  });
});
