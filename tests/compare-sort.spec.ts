import { test, expect } from '@playwright/test';

test('compare table sort toggles', async ({ page }) => {
  await page.goto('/compare/');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  const header = page.getByRole('button', { name: /Focus/i });
  await header.click();
  await expect(header).toContainText('↑');

  await header.click();
  await expect(header).toContainText('↓');
});
