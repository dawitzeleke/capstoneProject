import { test, expect, Page } from '@playwright/test';
import { signIn, signUpAsStudent, signUpAsTeacher, clearAuthData, loginTestUser, invalidTestEmail, testUser } from './helpers/auth.helper';


test.describe('Authentication Tests', () => {
  test.setTimeout(60000);
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081', { timeout: 60000 });
    await clearAuthData(page);
    await waitForPageLoad(page);
  });
  
  // Utility to wait a little for the page to settle
  async function waitForPageLoad(page: Page) {
    await page.waitForTimeout(1000); // Adjust if needed
  }

  // Updated helper: click on "Continue With Email" div
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

  test.describe('Sign In Tests', () => {
    
    test('should successfully sign in with valid credentials', async ({ page }) => {
      await continueWithEmail(page);
      console.log('Signing in with:', loginTestUser.email, loginTestUser.password);
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
      await page.getByText('Sign In', {exact: true}).click();
      await expect(page.getByText('Email is required')).toBeVisible();
      await expect(page.getByText('Password is required')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await continueWithEmail(page);
      await page.locator('input[type="email"]').fill(invalidTestEmail.email);
      await page.getByText('Sign In', {exact: true}).click();
      await expect(page.getByText('Enter a valid email address')).toBeVisible();
    });

    test('should validate password length', async ({ page }) => {
      await continueWithEmail(page);
      await page.locator('input[type="email"]').fill(loginTestUser.email);
      await page.locator('input[type="password"]').fill('short');
      await page.getByText('Sign In', {exact: true}).click();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });


  test.describe('Sign Up Tests', () => {
    test('should successfully sign up as a student', async ({ page }) => {
      await goToSignUpPage(page);
      await switchToStudentForm(page);
      await signUpAsStudent(page, testUser);
      await expect(page).toHaveURL(/.*\/student\/Home/);
    });

    test('should successfully sign up as a teacher', async ({ page }) => {
      await goToSignUpPage(page);
      await switchToTeacherForm(page);
      await signUpAsTeacher(page, testUser);
      await expect(page).toHaveURL(/.*\/teacher\/TeacherVerification/, { timeout: 60000 });
    });

  //   test('should validate required fields during sign up', async ({ page }) => {
  //     await goToSignUpPage(page);
  //     await switchToStudentForm(page);
  //     await page.getByRole('button', { name: 'Sign Up' }).click();
  //     await expect(page.getByText('First name is required')).toBeVisible();
  //     await expect(page.getByText('Last name is required')).toBeVisible();
  //     await expect(page.getByText('Email is required')).toBeVisible();
  //     await expect(page.getByText('Password is required')).toBeVisible();
  //     await expect(page.getByText('Phone number is required')).toBeVisible();
  //   });

  //   test('should show error for existing email', async ({ page }) => {
  //     await goToSignUpPage(page);
  //     await switchToStudentForm(page);
  //     await signUpAsStudent(page, testUser);
  //     await clearAuthData(page);

  //     await goToSignUpPage(page);
  //     await switchToStudentForm(page);
  //     await signUpAsStudent(page, testUser);

  //     await expect(page.getByText('A user with this email already exists')).toBeVisible();
  //   });

  //   test('should validate phone number format', async ({ page }) => {
  //     await goToSignUpPage(page);
  //     await switchToStudentForm(page);
  //     await page.getByLabel('Phone Number').fill('invalid-phone');
  //     await page.getByRole('button', { name: 'Sign Up' }).click();
  //     await expect(page.getByText('Enter a valid phone number')).toBeVisible();
  //   });

  //   test('should validate password requirements', async ({ page }) => {
  //     await goToSignUpPage(page);
  //     await switchToStudentForm(page);
  //     await page.getByLabel('Password').fill('weak');
  //     await page.getByRole('button', { name: 'Sign Up' }).click();
  //     await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  //   });

  //   test('should validate grade selection for students', async ({ page }) => {
  //     await goToSignUpPage(page);
  //     await switchToStudentForm(page);
  //     // Fill all required fields except grade
  //     await page.getByLabel('First Name').fill(testUser.firstName);
  //     await page.getByLabel('Last Name').fill(testUser.lastName);
  //     await page.getByLabel('Email').fill(testUser.email);
  //     await page.getByLabel('Password').fill(testUser.password);
  //     await page.getByLabel('Phone Number').fill(testUser.phoneNumber);
  //     await page.getByRole('button', { name: 'Sign Up' }).click();
  //     await expect(page.getByText('Grade is required')).toBeVisible();
  //   });
  }); // closes 'Sign Up Tests' describe
}); // closes 'Sign In Tests' describe
}); // closes main 'Authentication Tests' describe
