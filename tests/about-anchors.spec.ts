import { test, expect } from '@playwright/test';

test('about anchors render content', async ({ page }) => {
  await page.goto('/about/#questions');
  await expect(page.getByRole('heading', { name: /Questions/i })).toBeVisible();

  await page.goto('/about/#rules');
  await expect(page.getByRole('heading', { name: /Rules/i })).toBeVisible();
});
