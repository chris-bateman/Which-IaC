import { test, expect, type Page } from '@playwright/test';

async function answerAndNext(page: Page, label: string, isLast = false) {
  await page.getByRole('radio', { name: label }).check();
  const buttonName = isLast ? 'View results' : 'Next';
  await page.getByRole('button', { name: buttonName }).click();
}

test('cloudformation-required narrows results and shows reasons', async ({ page }) => {
  await page.goto('/quiz/');

  await answerAndNext(page, 'Yes, CloudFormation is required');
  await answerAndNext(page, 'Code-first required (Python/TypeScript)');
  await answerAndNext(page, 'Provisioning and managing cloud infrastructure');
  await answerAndNext(page, 'No, we want direct provisioning tools');
  await answerAndNext(page, 'AWS-native integration');
  await answerAndNext(page, 'I don’t want to operate state infrastructure');
  await answerAndNext(page, 'Yes, prefer a managed state service', true);

  await expect(page.getByRole('heading', { name: 'Ranked results' })).toBeVisible();

  // Only CloudFormation/CDK should remain when CloudFormation is required.
  await expect(page.getByRole('link', { name: 'AWS CDK' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'AWS CloudFormation' })).toBeVisible();

  // Excluded list should include Terraform.
  await expect(page.getByText('Terraform')).toBeVisible();
  await expect(page.getByText('Crossplane')).toBeVisible();

  // Recap should show selected answers.
  const recap = page.locator('.answer-recap');
  await expect(recap.getByText('Yes, CloudFormation is required')).toBeVisible();
  await expect(recap.getByText('No, we want direct provisioning tools')).toBeVisible();
  await expect(recap.getByText('AWS-native integration')).toBeVisible();
});
