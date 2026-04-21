import { vi } from 'vitest';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ isAuthenticated: false, userId: null }),
}));
