import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';
import { mockUnauthenticated, mockUser, USER_ID } from '~tests/helpers/auth';
import { truncateAll } from '~tests/helpers/db';
import {
  SAMPLE_RECIPE_DATA,
  seedCategory,
  seedIngredient,
  seedRecipe,
  seedSavedRecipe,
  seedUnit,
  UNVERIFIED_SAMPLE_RECIPE_DATA,
} from '~tests/helpers/seed';

import { DELETE } from '~/app/api/user/saved-recipes/[id]/route';
import { GET, POST } from '~/app/api/user/saved-recipes/route';
import { paginatedRecipesSchema, savedRecipeIdsSchema } from '~/lib/zod';

afterEach(truncateAll);

describe('GET /api/user/saved-recipes', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const res = await GET(new NextRequest('http://localhost/api/user/saved-recipes'));
    expect(res.status).toBe(401);
  });

  it('returns empty array when user has no saved recipes', async () => {
    mockUser(USER_ID);

    const res = await GET(new NextRequest('http://localhost/api/user/saved-recipes'));
    expect(res.status).toBe(200);

    const data = savedRecipeIdsSchema.parse(await res.json());
    expect(data).toHaveLength(0);
  });

  it('returns saved recipe ids and timestamps for the user', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedSavedRecipe(USER_ID, recipe.id);

    const res = await GET(new NextRequest('http://localhost/api/user/saved-recipes'));
    expect(res.status).toBe(200);

    const data = savedRecipeIdsSchema.parse(await res.json());

    expect(data).toHaveLength(1);
    expect(data.at(0)?.recipeId).toBe(recipe.id);
    expect(data.at(0)?.savedAt).toBeInstanceOf(Date);
  });

  it("returns only the authenticated user's saved recipes", async () => {
    mockUser(USER_ID);

    const { recipe: userRecipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const { recipe: otherRecipe } = await seedRecipe({
      categoryIds: [],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Other Recipe' },
      ingredientEntries: [],
      userId: 'other_user',
    });

    await seedSavedRecipe(USER_ID, userRecipe.id);
    await seedSavedRecipe('other_user', otherRecipe.id);

    const res = await GET(new NextRequest('http://localhost/api/user/saved-recipes'));
    expect(res.status).toBe(200);

    const data = savedRecipeIdsSchema.parse(await res.json());

    expect(data).toHaveLength(1);
    expect(data.at(0)?.recipeId).toBe(userRecipe.id);
  });
});

describe('GET /api/user/saved-recipes?include=recipe', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const res = await GET(
      new NextRequest('http://localhost/api/user/saved-recipes?include=recipe'),
    );
    expect(res.status).toBe(401);
  });

  it('returns 200 with empty data when user has no saved recipes', async () => {
    mockUser(USER_ID);

    const res = await GET(
      new NextRequest('http://localhost/api/user/saved-recipes?include=recipe'),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(0);
    expect(body.meta.total).toBe(0);
    expect(body.meta.currentPage).toBe(1);
  });

  it('returns saved recipes with full recipe data', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedSavedRecipe(USER_ID, recipe.id);

    const res = await GET(
      new NextRequest('http://localhost/api/user/saved-recipes?include=recipe'),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('does not return unsaved recipes', async () => {
    mockUser(USER_ID);

    await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(
      new NextRequest('http://localhost/api/user/saved-recipes?include=recipe'),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());
    expect(body.data).toHaveLength(0);
  });

  it('does not return unverified saved recipes', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: UNVERIFIED_SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedSavedRecipe(USER_ID, recipe.id);

    const res = await GET(
      new NextRequest('http://localhost/api/user/saved-recipes?include=recipe'),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());
    expect(body.data).toHaveLength(0);
  });

  it("does not return other users' saved recipes", async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: 'other_user',
    });

    await seedSavedRecipe('other_user', recipe.id);

    const res = await GET(
      new NextRequest('http://localhost/api/user/saved-recipes?include=recipe'),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());
    expect(body.data).toHaveLength(0);
  });

  it('filters saved recipes by category', async () => {
    mockUser(USER_ID);

    const catA = await seedCategory('Soup');
    const catB = await seedCategory('Pasta');
    if (!catA || !catB) throw new Error('Failed to seed categories');

    const { recipe: soupRecipe } = await seedRecipe({
      categoryIds: [catA.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const { recipe: pastaRecipe } = await seedRecipe({
      categoryIds: [catB.id],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Pasta Recipe' },
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedSavedRecipe(USER_ID, soupRecipe.id);
    await seedSavedRecipe(USER_ID, pastaRecipe.id);

    const res = await GET(
      new NextRequest(
        `http://localhost/api/user/saved-recipes?include=recipe&categories=${JSON.stringify([catA.id])}`,
      ),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('filters saved recipes by ingredients', async () => {
    mockUser(USER_ID);

    const ing1 = await seedIngredient('Tomato');
    const ing2 = await seedIngredient('Onion');
    const unit = await seedUnit('gramm', 'g');
    if (!ing1 || !ing2 || !unit) throw new Error('Failed to seed data');

    const { recipe: tomatoRecipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [{ ingredientId: ing1.id, quantity: 100, unitId: unit.id }],
      userId: USER_ID,
    });

    const { recipe: mixedRecipe } = await seedRecipe({
      categoryIds: [],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Mixed Recipe' },
      ingredientEntries: [
        { ingredientId: ing1.id, quantity: 50, unitId: unit.id },
        { ingredientId: ing2.id, quantity: 50, unitId: unit.id },
      ],
      userId: USER_ID,
    });

    await seedSavedRecipe(USER_ID, tomatoRecipe.id);
    await seedSavedRecipe(USER_ID, mixedRecipe.id);

    const res = await GET(
      new NextRequest(
        `http://localhost/api/user/saved-recipes?include=recipe&ingredients=${JSON.stringify([ing1.id])}`,
      ),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('filters saved recipes by search query', async () => {
    mockUser(USER_ID);

    const { recipe: soupRecipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const { recipe: chickenRecipe } = await seedRecipe({
      categoryIds: [],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Chicken Soup' },
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedSavedRecipe(USER_ID, soupRecipe.id);
    await seedSavedRecipe(USER_ID, chickenRecipe.id);

    const res = await GET(
      new NextRequest('http://localhost/api/user/saved-recipes?include=recipe&query=chicken'),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe('Chicken Soup');
  });

  it('paginates saved recipes correctly', async () => {
    mockUser(USER_ID);

    for (let i = 0; i < 10; i++) {
      const { recipe } = await seedRecipe({
        categoryIds: [],
        data: { ...SAMPLE_RECIPE_DATA, title: `Recipe ${i}` },
        ingredientEntries: [],
        userId: USER_ID,
      });
      await seedSavedRecipe(USER_ID, recipe.id);
    }

    const res = await GET(
      new NextRequest('http://localhost/api/user/saved-recipes?include=recipe&page=2'),
    );
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.meta.total).toBe(10);
    expect(body.meta.currentPage).toBe(2);
    expect(body.meta.pageCount).toBe(2);
    expect(body.data).toHaveLength(1);
  });
});

describe('POST /api/user/saved-recipes', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/user/saved-recipes', {
      body: JSON.stringify({ recipeId: 1 }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 for missing recipeId', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/saved-recipes', {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid recipeId', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/saved-recipes', {
      body: JSON.stringify({ recipeId: -1 }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for non-integer recipeId', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/saved-recipes', {
      body: JSON.stringify({ recipeId: 1.5 }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 201 and saves the recipe', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const req = new NextRequest('http://localhost/api/user/saved-recipes', {
      body: JSON.stringify({ recipeId: recipe.id }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.recipeId).toBe(recipe.id);
  });

  it('returns 409 when recipe is already saved', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedSavedRecipe(USER_ID, recipe.id);

    const req = new NextRequest('http://localhost/api/user/saved-recipes', {
      body: JSON.stringify({ recipeId: recipe.id }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/user/saved-recipes/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/user/saved-recipes/1', {
      method: 'DELETE',
    });

    const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(401);
  });

  it('returns 400 for a non-numeric id', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/saved-recipes/abc', {
      method: 'DELETE',
    });

    const res = await DELETE(req, { params: Promise.resolve({ id: 'abc' }) });
    expect(res.status).toBe(400);
  });

  it('returns 400 for a non-positive id', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/saved-recipes/0', {
      method: 'DELETE',
    });

    const res = await DELETE(req, { params: Promise.resolve({ id: '0' }) });
    expect(res.status).toBe(400);
  });

  it('returns 204 when the saved recipe is deleted', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedSavedRecipe(USER_ID, recipe.id);

    const req = new NextRequest(`http://localhost/api/user/saved-recipes/${recipe.id}`, {
      method: 'DELETE',
    });

    const res = await DELETE(req, { params: Promise.resolve({ id: String(recipe.id) }) });
    expect(res.status).toBe(204);
  });

  it('returns 204 even when the recipe was not saved', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/user/saved-recipes/9999', {
      method: 'DELETE',
    });

    const res = await DELETE(req, { params: Promise.resolve({ id: '9999' }) });
    expect(res.status).toBe(204);
  });

  it('does not delete saved recipes belonging to other users', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: 'other_user',
    });

    await seedSavedRecipe('other_user', recipe.id);

    const req = new NextRequest(`http://localhost/api/user/saved-recipes/${recipe.id}`, {
      method: 'DELETE',
    });

    const res = await DELETE(req, { params: Promise.resolve({ id: String(recipe.id) }) });
    expect(res.status).toBe(204);

    const getRes = await GET(new NextRequest('http://localhost/api/user/saved-recipes'));
    expect(getRes.status).toBe(200);

    const data = savedRecipeIdsSchema.parse(await getRes.json());
    expect(data).toHaveLength(0);

    mockUser('other_user');

    const otherGetRes = await GET(new NextRequest('http://localhost/api/user/saved-recipes'));
    expect(otherGetRes.status).toBe(200);

    const otherData = savedRecipeIdsSchema.parse(await otherGetRes.json());
    expect(otherData).toHaveLength(1);
  });
});
