import { vi } from 'vitest';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ isAuthenticated: false, userId: null }),
  clerkClient: vi.fn().mockResolvedValue({
    users: {
      getUser: vi.fn().mockResolvedValue({ firstName: 'Test', id: 'mock_user', lastName: 'User' }),
    },
  }),
}));
