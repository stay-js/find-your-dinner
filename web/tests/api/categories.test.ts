import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';

import { DELETE, PUT } from '~/app/api/categories/[id]/route';
import { GET, POST } from '~/app/api/categories/route';
import { categoriesSchema, idSchema } from '~/lib/zod';

import { ADMIN_ID, mockUnauthenticated, mockUser, USER_ID } from '../helpers/auth';
import { truncateAll } from '../helpers/db';
import { SAMPLE_RECIPE_DATA, seedAdmin, seedCategory, seedRecipe } from '../helpers/seed';

afterEach(truncateAll);

describe('GET /api/categories', () => {
  it('returns 200 with empty array when no categories exist', async () => {
    const res = await GET(new NextRequest('http://localhost/api/categories'));
    expect(res.status).toBe(200);

    const data = categoriesSchema.parse(await res.json());
    expect(data).toHaveLength(0);
  });

  it('returns seeded categories with canBeDeleted field', async () => {
    await seedCategory('Soup');

    const res = await GET(new NextRequest('http://localhost/api/categories'));
    expect(res.status).toBe(200);

    const [category] = categoriesSchema.parse(await res.json());

    expect(category?.name).toBe('Soup');
    expect(category?.canBeDeleted).toBe(true);
  });

  it('returns canBeDeleted false when category is used by a recipe', async () => {
    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    await seedRecipe({
      userId: USER_ID,

      data: SAMPLE_RECIPE_DATA,

      categoryIds: [cat.id],
      ingredientEntries: [],
    });

    const res = await GET(new NextRequest('http://localhost/api/categories'));
    expect(res.status).toBe(200);

    const [category] = categoriesSchema.parse(await res.json());
    expect(category?.canBeDeleted).toBe(false);
  });

  it('filters by query param', async () => {
    await seedCategory('Soup');
    await seedCategory('Pasta');

    const res = await GET(new NextRequest('http://localhost/api/categories?query=soup'));
    expect(res.status).toBe(200);

    const data = categoriesSchema.parse(await res.json());
    expect(data.at(0)?.name).toBe('Soup');
  });
});

describe('POST /api/categories', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/categories', {
      body: JSON.stringify({ name: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 403 when authenticated but not admin', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/categories', {
      body: JSON.stringify({ name: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('returns 201 when admin creates category', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/categories', {
      body: JSON.stringify({ name: 'Soup' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(idSchema.safeParse(data.categoryId).success).toBe(true);
  });

  it('returns 409 for duplicate name', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);
    await seedCategory('Soup');

    const req = new NextRequest('http://localhost/api/categories', {
      body: JSON.stringify({ name: 'Soup' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it('returns 400 for empty name', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/categories', {
      body: JSON.stringify({ name: '' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/categories/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const req = new NextRequest('http://localhost/api/categories/1', {
      body: JSON.stringify({ name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(401);
  });

  it('returns 403 when not admin', async () => {
    mockUser(USER_ID);

    const req = new NextRequest('http://localhost/api/categories/1', {
      body: JSON.stringify({ name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(403);
  });

  it('returns 204 when admin updates category', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const cat = await seedCategory('Old Name');
    if (!cat) throw new Error('Failed to seed category');

    const req = new NextRequest(`http://localhost/api/categories/${cat.id}`, {
      body: JSON.stringify({ name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: cat.id.toString() }) });
    expect(res.status).toBe(204);
  });

  it('returns 404 for non-existent category', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const req = new NextRequest('http://localhost/api/categories/99999', {
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
    await seedCategory('Existing');

    const cat = await seedCategory('To Rename');
    if (!cat) throw new Error('Failed to seed category');

    const req = new NextRequest(`http://localhost/api/categories/${cat.id}`, {
      body: JSON.stringify({ name: 'Existing' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: cat.id.toString() }) });
    expect(res.status).toBe(409);
  });

  it('returns 400 for invalid body', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const cat = await seedCategory('Soup');
    if (!cat) throw new Error('Failed to seed category');

    const req = new NextRequest(`http://localhost/api/categories/${cat.id}`, {
      body: JSON.stringify({ name: '' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    const res = await PUT(req, { params: Promise.resolve({ id: cat.id.toString() }) });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/categories/[id]', () => {
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

  it('returns 204 when admin deletes category', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const cat = await seedCategory('To Delete');
    if (!cat) throw new Error('Failed to seed category');

    const res = await DELETE(
      new NextRequest(`http://localhost/api/categories/${cat.id}`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: cat.id.toString() }) },
    );

    expect(res.status).toBe(204);
  });

  it('returns 404 for non-existent category', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const res = await DELETE(
      new NextRequest('http://localhost/api/categories/99999', { method: 'DELETE' }),
      { params: Promise.resolve({ id: '99999' }) },
    );

    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const res = await DELETE(
      new NextRequest('http://localhost/api/categories/not-a-number', { method: 'DELETE' }),
      { params: Promise.resolve({ id: 'not-a-number' }) },
    );

    expect(res.status).toBe(400);
  });
});
