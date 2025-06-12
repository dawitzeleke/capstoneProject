import { test, expect, Page } from '@playwright/test';
import { signIn, clearAuthData } from './helpers/auth.helper';

// Credentials for the teacher
const teacherEmail = 'Elroi@gmail.com';
const teacherPassword = '123456';

async function waitForPageLoad(page: Page) {
  await page.waitForTimeout(1000);
}

async function continueWithEmail(page: Page) {
  const continueDiv = page.getByText(/Continue With Email/i);
  await continueDiv.waitFor({ state: 'visible', timeout: 10000 });
  await continueDiv.click();
}

test.describe('Verify Question Upload', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081', { timeout: 60000 });
    await clearAuthData(page);
    await waitForPageLoad(page);
  });

  test('teacher logs in and uploads a question', async ({ page }) => {
    await continueWithEmail(page);
    await signIn(page, teacherEmail, teacherPassword);
    await expect(page).toHaveURL(/\/teacher\/Home/);

    // Navigate to the question upload page/tab
    await page.getByText(/Question/i).first().click();
    await expect(page.getByText(/Upload Question/i)).toBeVisible();

    // Fill in the question upload form (adjust selectors as needed)
    await page.getByPlaceholder('Enter your question').fill('What is the capital of France?');
    await page.getByPlaceholder('Enter option A').fill('Paris');
    await page.getByPlaceholder('Enter option B').fill('London');
    await page.getByPlaceholder('Enter option C').fill('Berlin');
    await page.getByPlaceholder('Enter option D').fill('Madrid');
    await page.getByPlaceholder('Enter the correct answer').fill('Paris');

    // Submit the form
    await page.getByRole('button', { name: /Upload|Submit/i }).click();

    // Assert success message or that the question appears in the list
    await expect(page.getByText(/Question uploaded successfully|Success/i)).toBeVisible();
  });
});
