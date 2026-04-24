import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { env } from '~/env';

const userCredentials = {
  identifier: env.TEST_E2E_CLERK_USER_USERNAME!,
  password: env.TEST_E2E_CLERK_USER_PASSWORD!,
  strategy: 'password' as const,
};

test.describe('unauthenticated', () => {
  test('shows sign in and sign up buttons', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Bejelentkezés' })).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByRole('button', { name: 'Regisztráció' })).toBeVisible({
      timeout: 5_000,
    });
  });

  test('does not show user button', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('button:has-text("Bejelentkezés")', { timeout: 5_000 });

    await expect(page.getByTestId('user-button')).not.toBeVisible();
  });
});

test.describe('authenticated', () => {
  test('signs in successfully via email and password', async ({ baseURL, page }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/');

    await page.getByRole('button', { name: 'Bejelentkezés' }).click();

    await page.fill('input#identifier-field', userCredentials.identifier);
    await page.getByRole('button', { exact: true, name: 'Continue' }).click();

    await page.fill('input#password-field', userCredentials.password);
    await page.getByRole('button', { exact: true, name: 'Continue' }).click();

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');

    await page.goto('/');

    await expect(page.getByTestId('user-button')).toBeVisible();
  });

  test('signs in successfully via clerk helper', async ({ baseURL, page }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/');

    await clerk.signIn({ page, signInParams: userCredentials });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');

    await page.goto('/');

    await expect(page.getByTestId('user-button')).toBeVisible();
  });

  test('hides sign in and sign up buttons', async ({ baseURL, page }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/');

    await clerk.signIn({ page, signInParams: userCredentials });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');

    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Bejelentkezés' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Regisztráció' })).not.toBeVisible();
  });

  test('shows dashboard link', async ({ baseURL, page }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/');

    await clerk.signIn({ page, signInParams: userCredentials });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');

    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Irányítópult' })).toBeVisible();
  });

  test('sign out via ui redirects to "/"', async ({ baseURL, page }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/');

    await clerk.signIn({ page, signInParams: userCredentials });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard');

    await page.getByTestId('user-button').click();
    await page.getByRole('menuitem', { name: 'Kijelentkezés' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Bejelentkezés' })).toBeVisible();
  });

  test('sign out via clerk helper redirects to "/"', async ({ baseURL, page }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/');

    await clerk.signIn({ page, signInParams: userCredentials });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard');

    await clerk.signOut({ page });

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Bejelentkezés' })).toBeVisible();
  });

  test('should redirect the user back to the previous page after signing in', async ({
    baseURL,
    page,
  }) => {
    await setupClerkTestingToken({ page });

    await page.goto('/recipes');

    await clerk.signIn({ page, signInParams: userCredentials });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/recipes');
  });
});
