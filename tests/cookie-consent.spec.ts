import { test, expect } from '@playwright/test';

test('cookie banner accept stores consent and shows manage button', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto('/');

  const banner = page.getByRole('dialog');
  await expect(banner).toBeVisible();

  await page.getByRole('button', { name: 'Accept' }).click();

  await expect(banner).toBeHidden();
  await expect(page.getByRole('button', { name: 'Manage cookies' })).toBeVisible();

  const stored = await page.evaluate(() => localStorage.getItem('whichiac:analytics-consent'));
  expect(stored).toBe('granted');
});

test('cookie banner decline stores denial and manage resets to banner', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto('/');

  const banner = page.getByRole('dialog');
  await expect(banner).toBeVisible();

  await page.getByRole('button', { name: 'Decline' }).click();

  await expect(banner).toBeHidden();
  await expect(page.getByRole('button', { name: 'Manage cookies' })).toBeVisible();

  let stored = await page.evaluate(() => localStorage.getItem('whichiac:analytics-consent'));
  expect(stored).toBe('denied');

  await page.getByRole('button', { name: 'Manage cookies' }).click();
  await expect(banner).toBeVisible();

  stored = await page.evaluate(() => localStorage.getItem('whichiac:analytics-consent'));
  expect(stored).toBeNull();
});
