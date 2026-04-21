import { auth } from '@clerk/nextjs/server';
import { vi } from 'vitest';

export function mockUnauthenticated() {
  vi.mocked(auth).mockResolvedValue({ isAuthenticated: false, userId: null } as never);
}

export function mockUser(userId: string) {
  vi.mocked(auth).mockResolvedValue({ isAuthenticated: true, userId } as never);
}
