// auth.spec.ts
import { test, expect, Page } from '@playwright/test';
import {
  signIn,
  signUpAsStudent,
  signUpAsTeacher,
  clearAuthData,
  loginTestUser,
  invalidTestEmail,
} from './helpers/auth.helper';

test.describe('Authentication Tests', () => {
  test.setTimeout(60000);

  async function waitForPageLoad(page: Page) {
    await page.waitForTimeout(1000);
  }

  async function continueWithEmail(page: Page) {
    const continueDiv = page.getByText(/Continue With Email/i);
    await continueDiv.waitFor({ state: 'visible', timeout: 10000 });
    await continueDiv.click();
  }

  async function goToSignUpPage(page: Page) {
    await continueWithEmail(page);
    await page.getByText('Sign Up', { exact: true }).click();
  }

  async function switchToStudentForm(page: Page) {
    await page.getByText('Student', { exact: true }).click();
  }

  async function switchToTeacherForm(page: Page) {
    await page.getByText('Teacher', { exact: true }).click();
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081', { timeout: 60000 });
    await clearAuthData(page);
    await waitForPageLoad(page);
  });

  test.describe('Sign In Tests', () => {
    test('should successfully sign in with valid credentials', async ({ page }) => {
      await continueWithEmail(page);
      await signIn(page, loginTestUser.email, loginTestUser.password);
      await expect(page).toHaveURL(/.*\/student\/Home/);
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await continueWithEmail(page);
      await signIn(page, 'invalid@example.com', 'wrongpassword');
      await expect(page.getByText('Login failed')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await continueWithEmail(page);
      await page.getByText('Sign In', { exact: true }).click();
      await expect(page.getByText('Email is required')).toBeVisible();
      await expect(page.getByText('Password is required')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await continueWithEmail(page);
      await page.locator('input[type="email"]').fill(invalidTestEmail.email);
      await page.getByText('Sign In', { exact: true }).click();
      await expect(page.getByText('Enter a valid email address')).toBeVisible();
    });

    test('should validate password length', async ({ page }) => {
      await continueWithEmail(page);
      await page.locator('input[type="email"]').fill(loginTestUser.email);
      await page.locator('input[type="password"]').fill('short');
      await page.getByText('Sign In', { exact: true }).click();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });
  });

  test.describe('Sign Up Tests', () => {
    test('should successfully sign up as a student', async ({ page }) => {
      await goToSignUpPage(page);
      await switchToStudentForm(page);
      await signUpAsStudent(page);
      await expect(page).toHaveURL(/.*\/student\/Home/);
    });

    test('should successfully sign up as a teacher', async ({ page }) => {
      await goToSignUpPage(page);
      await switchToTeacherForm(page);
      await signUpAsTeacher(page);
      await expect(page).toHaveURL(/.*\/teacher\/TeacherVerification/);
    });
  });
});
