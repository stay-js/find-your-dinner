import { expect, test } from '@playwright/test';

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

    await expect(page.getByTestId('user-menu-button')).not.toBeVisible();
  });
});
