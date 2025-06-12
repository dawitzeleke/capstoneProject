import { test, expect, Page } from '@playwright/test';
import { signIn, loginTestUser, clearAuthData } from './helpers/auth.helper';

// Helper to wait for the page to settle
async function waitForPageLoad(page: Page) {
  await page.waitForTimeout(1000);
}

async function continueWithEmail(page: Page) {
  const continueDiv = page.getByText(/Continue With Email/i);
  await continueDiv.waitFor({ state: 'visible', timeout: 10000 });
  await continueDiv.click();
}

test.describe('Questions Page Feature', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081', { timeout: 60000 });
    await clearAuthData(page);
    await waitForPageLoad(page);
  });

  test('should login and navigate to Questions tab', async ({ page }) => {
    await continueWithEmail(page);
    await signIn(page, loginTestUser.email, loginTestUser.password);
    // Wait for home page to load
    await expect(page).toHaveURL(/.*\/student\/Home/);
    // Click on the Questions tab using accessible name
   await page.locator('text=Question').first().click();
    // Assert that the Questions page/tab is visible
    await expect(page.getByText(/Follow/i)).toBeVisible();
    // Optionally, check for a question card or list
    // await expect(page.getByTestId('question-card')).toBeVisible();
  });
});
