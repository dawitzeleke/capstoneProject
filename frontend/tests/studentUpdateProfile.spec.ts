import { test, expect, Page } from '@playwright/test';
import { signIn, clearAuthData } from './helpers/auth.helper';

// Credentials for the student
const studentEmail = 'Adonai@gmail.com'; // Replace with a real student email
const studentPassword = 'Adonai'; // Replace with the real password

async function waitForPageLoad(page: Page) {
  await page.waitForTimeout(1000);
}

async function continueWithEmail(page: Page) {
  const continueDiv = page.getByText(/Continue With Email/i);
  await continueDiv.waitFor({ state: 'visible', timeout: 10000 });
  await continueDiv.click();
}

test.describe('Student Update Profile', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081', { timeout: 60000 });
    await clearAuthData(page);
    await waitForPageLoad(page);
  });

  test('student logs in and updates profile', async ({ page }) => {
    await continueWithEmail(page);
    await signIn(page, studentEmail, studentPassword);
    await expect(page).toHaveURL(/\/student\/Home/);

    // Navigate to Edit Profile tab/screen
    await page.getByText(/Profile|Edit Profile/i).first().click();
    await expect(page.getByText(/Edit Profile|Update Profile/i)).toBeVisible();

    // Fill in the profile update form (adjust selectors as needed)
    await page.getByPlaceholder('Full Name').fill('Updated Student Name');
    await page.getByPlaceholder('Phone Number').fill('1234567890');
    // Add more fields as needed

    // Submit the form
    await page.getByRole('button', { name: /Update|Save/i }).click();

    // Assert success message or updated value
    await expect(page.getByText(/Profile updated successfully|Success/i)).toBeVisible();
  });
});
