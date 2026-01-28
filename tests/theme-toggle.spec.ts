import { test, expect } from '@playwright/test';

test('theme toggle respects stored preference and toggles mode', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');
  });

  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: 'Switch to light mode' }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  const stored = await page.evaluate(() => localStorage.getItem('theme'));
  expect(stored).toBe('light');
});

test('manage cookies button sits in footer on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await page.addInitScript(() => {
    localStorage.setItem('whichiac:analytics-consent', 'granted');
  });

  await page.goto('/');

  const manageButton = page.locator('footer').getByRole('button', { name: 'Manage cookies' });
  await expect(manageButton).toBeVisible();

  const position = await manageButton.evaluate((node) => getComputedStyle(node).position);
  expect(position).toBe('static');
});
