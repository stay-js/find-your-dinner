import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';
import { ADMIN_ID, mockUnauthenticated, mockUser, USER_ID } from '~tests/helpers/auth';
import { truncateAll } from '~tests/helpers/db';
import {
  SAMPLE_RECIPE_DATA,
  seedAdmin,
  seedCategory,
  seedIngredient,
  seedRecipe,
  seedUnit,
  UNVERIFIED_SAMPLE_RECIPE_DATA,
} from '~tests/helpers/seed';

import { DELETE, GET as GET_BY_ID, PUT } from '~/app/api/recipes/[id]/route';
import { GET, POST } from '~/app/api/recipes/route';
import { fullRecipeSchema, idSchema, paginatedRecipesSchema } from '~/lib/zod';

afterEach(truncateAll);

type Deps = {
  category: { id: number };
  ingredient: { id: number };
  unit: { id: number };
};

function buildValidBody({ category, ingredient, unit }: Deps) {
  return {
    title: 'Test Recipe',

    description: 'A test description',
    instructions: 'Test instructions',

    previewImageUrl: 'https://example.com/image.jpg',

    cookTimeMinutes: 30,
    prepTimeMinutes: 15,

    servings: 4,

    categories: [category.id],
    ingredients: [{ ingredientId: ingredient.id, quantity: 100, unitId: unit.id }],
  };
}

async function seedDeps() {
  const category = await seedCategory('Main Course');
  const ingredient = await seedIngredient('Tomato');
  const unit = await seedUnit('gramm', 'g');

  if (!category || !ingredient || !unit) throw new Error('Failed to seed dependencies');

  return { category, ingredient, unit };
}

describe('GET /api/recipes', () => {
  it('returns 200 with empty data and pagination meta when no recipes exist', async () => {
    const res = await GET(new NextRequest('http://localhost/api/recipes'));

    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(0);
    expect(body.meta.total).toBe(0);
    expect(body.meta.currentPage).toBe(1);
  });

  it('returns verified recipes with pagination meta', async () => {
    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(new NextRequest('http://localhost/api/recipes'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.meta.total).toBe(1);
    expect(body.data.at(0)?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('does not return unverified recipes by default', async () => {
    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    await seedRecipe({
      categoryIds: [cat.id],
      data: UNVERIFIED_SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(new NextRequest('http://localhost/api/recipes'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());
    expect(body.data).toHaveLength(0);
  });

  it('returns 401 when unauthenticated and allow-unverified is set', async () => {
    mockUnauthenticated();

    const res = await GET(new NextRequest('http://localhost/api/recipes?allow-unverified=1'));
    expect(res.status).toBe(401);
  });

  it('returns 403 when non-admin and allow-unverified is set', async () => {
    mockUser(USER_ID);

    const res = await GET(new NextRequest('http://localhost/api/recipes?allow-unverified=1'));
    expect(res.status).toBe(403);
  });

  it('returns unverified recipes when admin and allow-unverified is set', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    await seedRecipe({
      categoryIds: [cat.id],
      data: UNVERIFIED_SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(new NextRequest('http://localhost/api/recipes?allow-unverified=1'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.verified).toBe(false);
  });

  it('returns 401 when unauthenticated and only-awaiting-verification is set', async () => {
    mockUnauthenticated();

    const res = await GET(
      new NextRequest('http://localhost/api/recipes?only-awaiting-verification=1'),
    );

    expect(res.status).toBe(401);
  });

  it('returns 403 when non-admin and only-awaiting-verification is set', async () => {
    mockUser(USER_ID);

    const res = await GET(
      new NextRequest('http://localhost/api/recipes?only-awaiting-verification=1'),
    );

    expect(res.status).toBe(403);
  });

  it('returns only unverified recipes when admin and only-awaiting-verification is set', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedRecipe({
      categoryIds: [cat.id],
      data: UNVERIFIED_SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(
      new NextRequest('http://localhost/api/recipes?only-awaiting-verification=1'),
    );

    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.verified).toBe(false);
  });

  it('filters recipes by category', async () => {
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
      new NextRequest(`http://localhost/api/recipes?categories=${JSON.stringify([catA.id])}`),
    );

    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('filters recipes by ingredients', async () => {
    const cat = await seedCategory('Soup');
    const ing1 = await seedIngredient('Tomato');
    const ing2 = await seedIngredient('Onion');
    const unit = await seedUnit('gramm', 'g');
    if (!cat || !ing1 || !ing2 || !unit) throw new Error('Failed to seed data');

    await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [{ ingredientId: ing1.id, quantity: 100, unitId: unit.id }],
      userId: USER_ID,
    });

    await seedRecipe({
      categoryIds: [cat.id],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Onion Recipe' },
      ingredientEntries: [
        { ingredientId: ing1.id, quantity: 50, unitId: unit.id },
        { ingredientId: ing2.id, quantity: 50, unitId: unit.id },
      ],
      userId: USER_ID,
    });

    const res = await GET(
      new NextRequest(`http://localhost/api/recipes?ingredients=${JSON.stringify([ing1.id])}`),
    );

    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data[0]?.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
  });

  it('filters recipes by search query', async () => {
    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    await seedRecipe({
      categoryIds: [cat.id],
      data: { ...SAMPLE_RECIPE_DATA, title: 'Chicken Soup' },
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET(new NextRequest('http://localhost/api/recipes?query=Chicken'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(1);
    expect(body.data.at(0)?.recipeData.title).toBe('Chicken Soup');
  });

  it('paginates results correctly', async () => {
    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    for (let i = 0; i < 3; i++) {
      await seedRecipe({
        categoryIds: [cat.id],
        data: { ...SAMPLE_RECIPE_DATA, title: `Recipe ${i}` },
        ingredientEntries: [],
        userId: USER_ID,
      });
    }

    const res = await GET(new NextRequest('http://localhost/api/recipes?per-page=2&page=1'));
    expect(res.status).toBe(200);

    const body = paginatedRecipesSchema.parse(await res.json());

    expect(body.data).toHaveLength(2);
    expect(body.meta.total).toBe(3);
    expect(body.meta.pageCount).toBe(2);
    expect(body.meta.perPage).toBe(2);
  });
});

describe('POST /api/recipes', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const deps = await seedDeps();

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify(buildValidBody(deps)),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(401);
  });

  it('returns 201 and recipeId when authenticated user creates recipe', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify(buildValidBody(deps)),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(201);

    const data = await res.json();
    expect(idSchema.safeParse(data.recipeId).success).toBe(true);
  });

  it('returns 400 for missing required fields', async () => {
    mockUser(USER_ID);

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(400);
  });

  it('returns 400 for empty title', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify({ ...buildValidBody(deps), title: '' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(400);
  });

  it('returns 400 for empty categories array', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify({ ...buildValidBody(deps), categories: [] }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(400);
  });

  it('returns 400 for empty ingredients array', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify({ ...buildValidBody(deps), ingredients: [] }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(400);
  });

  it('returns 400 for non-https previewImageUrl', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify({
          ...buildValidBody(deps),
          previewImageUrl: 'http://example.com/image.jpg',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(400);
  });

  it('returns 400 for negative cookTimeMinutes', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify({ ...buildValidBody(deps), cookTimeMinutes: -1 }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(400);
  });

  it('returns 400 for zero servings', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await POST(
      new NextRequest('http://localhost/api/recipes', {
        body: JSON.stringify({ ...buildValidBody(deps), servings: 0 }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(res.status).toBe(400);
  });
});

describe('GET /api/recipes/[id]', () => {
  it('returns 200 with full recipe data for a verified recipe', async () => {
    const cat = await seedCategory('Soup');
    const ing = await seedIngredient('Tomato');
    const unit = await seedUnit('gramm', 'g');
    if (!cat || !ing || !unit) throw new Error('Failed to seed data');

    const { recipe } = await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [{ ingredientId: ing.id, quantity: 100, unitId: unit.id }],
      userId: USER_ID,
    });

    const res = await GET_BY_ID(new NextRequest(`http://localhost/api/recipes/${recipe.id}`), {
      params: Promise.resolve({ id: recipe.id.toString() }),
    });

    expect(res.status).toBe(200);

    const data = fullRecipeSchema.parse(await res.json());

    expect(data.recipeData.title).toBe(SAMPLE_RECIPE_DATA.title);
    expect(data.ingredients).toHaveLength(1);
    expect(data.categories).toHaveLength(1);
  });

  it('returns 404 for non-existent recipe', async () => {
    const res = await GET_BY_ID(new NextRequest('http://localhost/api/recipes/99999'), {
      params: Promise.resolve({ id: '99999' }),
    });

    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    const res = await GET_BY_ID(new NextRequest('http://localhost/api/recipes/not-a-number'), {
      params: Promise.resolve({ id: 'not-a-number' }),
    });

    expect(res.status).toBe(400);
  });

  it('returns 404 for unverified recipe without allow-unverified flag', async () => {
    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    const { recipe } = await seedRecipe({
      categoryIds: [cat.id],
      data: UNVERIFIED_SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET_BY_ID(new NextRequest(`http://localhost/api/recipes/${recipe.id}`), {
      params: Promise.resolve({ id: recipe.id.toString() }),
    });

    expect(res.status).toBe(404);
  });

  it('returns 401 when unauthenticated and allow-unverified is set', async () => {
    mockUnauthenticated();

    const res = await GET_BY_ID(
      new NextRequest('http://localhost/api/recipes/1?allow-unverified=1'),
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(res.status).toBe(401);
  });

  it('returns 403 when non-admin and allow-unverified is set', async () => {
    mockUser(USER_ID);

    const res = await GET_BY_ID(
      new NextRequest('http://localhost/api/recipes/1?allow-unverified=1'),
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(res.status).toBe(403);
  });

  it('returns unverified recipe when admin and allow-unverified is set', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    const { recipe } = await seedRecipe({
      categoryIds: [cat.id],
      data: UNVERIFIED_SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await GET_BY_ID(
      new NextRequest(`http://localhost/api/recipes/${recipe.id}?allow-unverified=1`),
      { params: Promise.resolve({ id: recipe.id.toString() }) },
    );

    expect(res.status).toBe(200);

    const data = fullRecipeSchema.parse(await res.json());
    expect(data.recipeData.verified).toBe(false);
  });
});

describe('PUT /api/recipes/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const deps = await seedDeps();

    const res = await PUT(
      new NextRequest('http://localhost/api/recipes/1', {
        body: JSON.stringify(buildValidBody(deps)),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }),
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid id', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await PUT(
      new NextRequest('http://localhost/api/recipes/not-a-number', {
        body: JSON.stringify(buildValidBody(deps)),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }),
      { params: Promise.resolve({ id: 'not-a-number' }) },
    );

    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent recipe', async () => {
    mockUser(USER_ID);

    const deps = await seedDeps();

    const res = await PUT(
      new NextRequest('http://localhost/api/recipes/99999', {
        body: JSON.stringify(buildValidBody(deps)),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }),
      { params: Promise.resolve({ id: '99999' }) },
    );

    expect(res.status).toBe(404);
  });

  it('returns 403 when user tries to update another user recipe', async () => {
    mockUser(USER_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    const { recipe } = await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: 'other_user',
    });

    const deps = await seedDeps();

    const res = await PUT(
      new NextRequest(`http://localhost/api/recipes/${recipe.id}`, {
        body: JSON.stringify(buildValidBody(deps)),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }),
      { params: Promise.resolve({ id: recipe.id.toString() }) },
    );

    expect(res.status).toBe(403);
  });

  it('returns 400 for invalid body', async () => {
    mockUser(USER_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    const { recipe } = await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await PUT(
      new NextRequest(`http://localhost/api/recipes/${recipe.id}`, {
        body: JSON.stringify({ title: '' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }),
      { params: Promise.resolve({ id: recipe.id.toString() }) },
    );

    expect(res.status).toBe(400);
  });

  it('returns 204 when owner updates own recipe', async () => {
    mockUser(USER_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    const { recipe } = await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const deps = await seedDeps();

    const res = await PUT(
      new NextRequest(`http://localhost/api/recipes/${recipe.id}`, {
        body: JSON.stringify(buildValidBody(deps)),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }),
      { params: Promise.resolve({ id: recipe.id.toString() }) },
    );

    expect(res.status).toBe(204);
  });

  it('returns 204 when admin updates any recipe', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    const { recipe } = await seedRecipe({
      categoryIds: [cat.id],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const deps = await seedDeps();

    const res = await PUT(
      new NextRequest(`http://localhost/api/recipes/${recipe.id}`, {
        body: JSON.stringify(buildValidBody(deps)),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }),
      { params: Promise.resolve({ id: recipe.id.toString() }) },
    );

    expect(res.status).toBe(204);
  });
});

describe('DELETE /api/recipes/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const res = await DELETE(
      new NextRequest('http://localhost/api/recipes/1', { method: 'DELETE' }),
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid id', async () => {
    mockUser(USER_ID);

    const res = await DELETE(
      new NextRequest('http://localhost/api/recipes/not-a-number', { method: 'DELETE' }),
      { params: Promise.resolve({ id: 'not-a-number' }) },
    );

    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent recipe', async () => {
    mockUser(USER_ID);

    const res = await DELETE(
      new NextRequest('http://localhost/api/recipes/99999', { method: 'DELETE' }),
      { params: Promise.resolve({ id: '99999' }) },
    );

    expect(res.status).toBe(404);
  });

  it('returns 403 when user tries to delete another user recipe', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: 'other_user',
    });

    const res = await DELETE(
      new NextRequest(`http://localhost/api/recipes/${recipe.id}`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: recipe.id.toString() }) },
    );

    expect(res.status).toBe(403);
  });

  it('returns 204 when owner deletes own recipe', async () => {
    mockUser(USER_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await DELETE(
      new NextRequest(`http://localhost/api/recipes/${recipe.id}`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: recipe.id.toString() }) },
    );

    expect(res.status).toBe(204);
  });

  it('returns 204 when admin deletes any recipe', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const { recipe } = await seedRecipe({
      categoryIds: [],
      data: SAMPLE_RECIPE_DATA,
      ingredientEntries: [],
      userId: USER_ID,
    });

    const res = await DELETE(
      new NextRequest(`http://localhost/api/recipes/${recipe.id}`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: recipe.id.toString() }) },
    );

    expect(res.status).toBe(204);
  });
});
