import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { env } from '~/env';

const userCredentials = {
  identifier: env.TEST_E2E_CLERK_USER_USERNAME!,
  password: env.TEST_E2E_CLERK_USER_PASSWORD!,
  strategy: 'password' as const,
};

const adminCredentials = {
  identifier: env.TEST_E2E_CLERK_ADMIN_USERNAME!,
  password: env.TEST_E2E_CLERK_ADMIN_PASSWORD!,
  strategy: 'password' as const,
};

test('redirects "/dashboard" to sign in when unauthenticated', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL(/sign-in/);
});

test.describe('regular user', () => {
  test.beforeEach(async ({ baseURL, page }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/');

    await clerk.signIn({ page, signInParams: userCredentials });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');
  });

  test('does not show admin nav section in dashboard sidebar', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('Adminisztráció')).not.toBeVisible();
  });

  test('does not show admin nav section in dashboard landing page', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Admin' })).not.toBeVisible();
  });

  test('shows forbidden page when accessing admin routes', async ({ page }) => {
    await page.goto('/dashboard/admin/recipes');

    await expect(page).toHaveURL('/forbidden');
    await expect(page.getByRole('heading', { name: '403' })).toBeVisible();
  });
});

test.describe('admin user', () => {
  test.beforeEach(async ({ baseURL, page }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/');

    await clerk.signIn({ page, signInParams: adminCredentials });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');
  });

  test('shows admin nav section in dashboard sidebar', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('Adminisztráció').first()).toBeVisible();
  });

  test('shows admin nav section in dashboard landing page', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();
  });

  test('can access admin routes', async ({ page }) => {
    await page.goto('/dashboard/admin/recipes');

    await expect(page).not.toHaveURL(/forbidden/);
    await expect(page).toHaveURL('/dashboard/admin/recipes');
  });
});
