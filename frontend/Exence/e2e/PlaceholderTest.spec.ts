import { test, expect } from '@playwright/test';

test.describe('Exence Placeholder Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Exence/);
    await expect(page.locator('ex-root')).toBeVisible();

    await expect(page.locator('ex-login')).toBeVisible();

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  });
});
