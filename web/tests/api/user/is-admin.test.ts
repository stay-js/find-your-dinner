import { afterEach, describe, expect, it } from 'vitest';
import { ADMIN_ID, mockUnauthenticated, mockUser, USER_ID } from '~tests/helpers/auth';
import { truncateAll } from '~tests/helpers/db';
import { seedAdmin } from '~tests/helpers/seed';

import { GET } from '~/app/api/user/is-admin/route';
import { isAdminSchema } from '~/lib/zod';

afterEach(truncateAll);

describe('GET /api/user/is-admin', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauthenticated();

    const res = await GET();
    expect(res.status).toBe(401);

    const data = isAdminSchema.parse(await res.json());
    expect(data.isAdmin).toBe(false);
  });

  it('returns isAdmin false for a regular user', async () => {
    mockUser(USER_ID);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = isAdminSchema.parse(await res.json());
    expect(data.isAdmin).toBe(false);
  });

  it('returns isAdmin true for an admin user', async () => {
    mockUser(ADMIN_ID);
    await seedAdmin(ADMIN_ID);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = isAdminSchema.parse(await res.json());
    expect(data.isAdmin).toBe(true);
  });
});
