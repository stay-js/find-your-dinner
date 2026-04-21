import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';
import { mockUnauthenticated, mockUser, USER_ID } from '~tests/helpers/auth';
import { truncateAll } from '~tests/helpers/db';
import {
  SAMPLE_RECIPE_DATA,
  seedCategory,
  seedIngredient,
  seedRecipe,
  seedUnit,
  UNVERIFIED_SAMPLE_RECIPE_DATA,
} from '~tests/helpers/seed';

import { GET } from '~/app/api/user/recipes/route';
import { paginatedRecipesSchema } from '~/lib/zod';

afterEach(truncateAll);

describe('GET /api/user/recipes', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const res = await GET(new NextRequest('http://localhost/api/user/recipes'));
    expect(res.status).toBe(401);
  });

  it('returns 200 with empty data when user has no recipes', async () => {
    mockUser(USER_ID);

    const res = await GET(new NextRequest('http://localhost/api/user/recipes'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(0);
    expect(body.meta.total).toBe(0);
    expect(body.meta.currentPage).toBe(1);
  });

  it("returns only the authenticated user's recipes", async () => {
    mockUser(USER_ID);

    await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedRecipe({
      categoryIds: [],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Other User Recipe' },
      ingredientEntries: [],
      userId: 'other_user',
    });

    const res = await GET(new NextRequest('http://localhost/api/user/recipes'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('returns both verified and unverified recipes for the user', async () => {
    mockUser(USER_ID);

    await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedRecipe({
      categoryIds: [],
      data: UNVERIFIED_SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(new NextRequest('http://localhost/api/user/recipes'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());
    expect(body.meta.total).toBe(2);

    const verifiedFlags = body.data.map((r) => r.recipeData.verified);

    expect(verifiedFlags).toContain(true);
    expect(verifiedFlags).toContain(false);
  });

  it('filters recipes by category', async () => {
    mockUser(USER_ID);

    const catA = await seedCategory('Soup');
    const catB = await seedCategory('Pasta');
    if (!catA || !catB) throw new Error('Failed to seed categories');

    await seedRecipe({
      categoryIds: [catA.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedRecipe({
      categoryIds: [catB.id],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Pasta Recipe' },
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(
      new NextRequest(`http://localhost/api/user/recipes?categories=${JSON.stringify([catA.id])}`),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('filters recipes by ingredients', async () => {
    mockUser(USER_ID);

    const ing1 = await seedIngredient('Tomato');
    const ing2 = await seedIngredient('Onion');
    const unit = await seedUnit('gramm', 'g');
    if (!ing1 || !ing2 || !unit) throw new Error('Failed to seed data');

    await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [{ ingredientId: ing1.id, quantity: 100, unitId: unit.id }],
      userId: USER_ID,
    });

    await seedRecipe({
      categoryIds: [],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Mixed Recipe' },
      ingredientEntries: [
        { ingredientId: ing1.id, quantity: 50, unitId: unit.id },
        { ingredientId: ing2.id, quantity: 50, unitId: unit.id },
      ],
      userId: USER_ID,
    });

    const res = await GET(
      new NextRequest(`http://localhost/api/user/recipes?ingredients=${JSON.stringify([ing1.id])}`),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('filters recipes by search query', async () => {
    mockUser(USER_ID);

    await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedRecipe({
      categoryIds: [],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Chicken Soup' },
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(new NextRequest('http://localhost/api/user/recipes?query=chicken'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe('Chicken Soup');
  });

  it('paginates results correctly', async () => {
    mockUser(USER_ID);

    for (let i = 0; i < 10; i++) {
      await seedRecipe({
        categoryIds: [],
        data: { ...SAMPLE_RECIPE_DATA, title: `Recipe ${i}` },
        ingredientEntries: [],
        userId: USER_ID,
      });
    }

    const res = await GET(new NextRequest('http://localhost/api/user/recipes?page=2'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.meta.total).toBe(10);
    expect(body.meta.currentPage).toBe(2);
    expect(body.meta.pageCount).toBe(2);
    expect(body.data).toHaveLength(1);
  });

  it('does not return recipes from other users when filtering', async () => {
    mockUser(USER_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: 'other_user',
    });

    const res = await GET(
      new NextRequest(`http://localhost/api/user/recipes?categories=${JSON.stringify([cat.id])}`),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());
    expect(body.data).toHaveLength(0);
  });
});
