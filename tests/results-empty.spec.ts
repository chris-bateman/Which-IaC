import { test, expect } from '@playwright/test';

test('result page without answers prompts to start quiz', async ({ page }) => {
  await page.goto('/result/');
  await expect(page.getByRole('heading', { name: 'No stored answers' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open questionnaire' })).toBeVisible();
});
