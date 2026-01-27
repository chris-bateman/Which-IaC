import { test, expect } from '@playwright/test';
import questions from '../src/data/questions.json' assert { type: 'json' };

test('quiz flow completes and shows results', async ({ page }) => {
  await page.goto('/quiz/');

  for (let index = 0; index < questions.length; index += 1) {
    const firstOption = page.getByRole('radio').first();
    await expect(firstOption).toBeVisible();
    await firstOption.check();

    const isLast = index === questions.length - 1;
    const buttonName = isLast ? 'See results' : 'Next';
    await page.getByRole('button', { name: buttonName }).click();
  }

  await expect(page.getByRole('heading', { name: 'Recommended tools' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your answers' })).toBeVisible();
});
