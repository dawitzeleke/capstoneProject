// This file provides helper functions and test data for authentication-related Playwright tests.
// It makes it easy to automate sign in and sign up flows for both students and teachers, and ensures each test uses unique emails and phone numbers to avoid conflicts.
//
// Major functions:
// - signIn: Automates the sign-in process by filling in the email and password fields and submitting the form.
// - signUpAsStudent: Automates the student sign-up process, generating a unique email and phone number if not provided, and filling all required fields.
// - signUpAsTeacher: Automates the teacher sign-up process, also generating unique credentials and filling the form.
// - clearAuthData: Clears localStorage and sessionStorage to ensure a clean state before each test.
// - generateUniqueEmail / generateUniquePhoneNumber: Utility functions to create unique credentials for each test run.
//
// The file also exports some default test users for convenience.
//
// This setup helps keep Playwright tests reliable and independent, avoiding issues with duplicate users or leftover authentication state.

// auth.helper.ts
import { Page } from '@playwright/test';

// --- Test user data for student sign up ---
export const testStudent = {
  email: 'teststudent4@example.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '102923238474',
  grade: '12',
  stream: 'NaturalScience',
};

// --- Test user data for teacher sign up ---
export const testTeacher = {
  email: 'testteacher4@example.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '0192328374234',
};

// --- Automates the sign-in process for any user ---
export async function signIn(page: Page, email: string, password: string) {
  await page.getByText('Sign In', { exact: true }).click();
  await page.waitForSelector('input[type="email"]');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByText('Sign In', { exact: true }).click();
}

// --- Utility to generate a unique email for each test run ---
function generateUniqueEmail(prefix: string = 'testuser'): string {
  const timestamp = Date.now();
  return `${prefix}${timestamp}@example.com`;
}

// --- Utility to generate a unique phone number for each test run ---
function generateUniquePhoneNumber(): string {
  return '1' + Math.floor(100000000 + Math.random() * 900000000).toString();
}

// --- Automates the student sign-up process, using unique credentials by default ---
export async function signUpAsStudent(page: Page, userData: Partial<typeof testStudent> = {}) {
  const uniqueEmail = userData.email || generateUniqueEmail('student');
  const uniquePhone = userData.phoneNumber || generateUniquePhoneNumber();
  await page.getByPlaceholder('Enter your first name').fill(userData.firstName || testStudent.firstName);
  await page.getByPlaceholder('Enter your last name').fill(userData.lastName || testStudent.lastName);
  await page.locator('#Email').fill(uniqueEmail);
  await page.locator('#Password').fill(userData.password || testStudent.password);
  await page.getByPlaceholder('Enter your phone number').fill(uniquePhone);

  // Select Grade
  await page.getByText('Select Grade').click();
  await page.getByText(userData.grade || testStudent.grade, { exact: true }).click();

  // Select Stream
  await page.getByText(userData.stream || testStudent.stream, { exact: true }).click();
  await page.locator('#SignUpButton').click();
}

// --- Automates the teacher sign-up process, using unique credentials by default ---
export async function signUpAsTeacher(page: Page, userData: Partial<typeof testTeacher> = {}) {
  const uniqueEmail = userData.email || generateUniqueEmail('teacher');
  const uniquePhone = userData.phoneNumber || generateUniquePhoneNumber();
  await page.getByPlaceholder('Enter your first name').fill(userData.firstName || testTeacher.firstName);
  await page.getByPlaceholder('Enter your last name').fill(userData.lastName || testTeacher.lastName);
  await page.locator('#Email').fill(uniqueEmail);
  await page.locator('#Password').fill(userData.password || testTeacher.password);
  await page.getByPlaceholder('Enter your phone number').fill(uniquePhone);
  await page.locator('#SignUpButton').click(); // Submit the form
}

// --- Clears browser storage to ensure a clean state before each test ---
export async function clearAuthData(page: Page) {
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() => sessionStorage.clear());
}

// --- Default test user for login tests ---
export const loginTestUser = {
  email: 'dawitstudent@gmail.com',
  password: '1qa2ws3ee',
};

// --- Invalid email for negative test cases ---
export const invalidTestEmail = {
  email: 'invalid',
};
