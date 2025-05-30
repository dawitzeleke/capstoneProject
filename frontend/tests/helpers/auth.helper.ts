// auth.helper.ts
import { Page } from '@playwright/test';

export const testStudent = {
  email: 'teststudent3@example.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '1029238474',
  grade: '12',
  stream: 'NaturalScience',
};

export const testTeacher = {
  email: 'testteacher3@example.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '019228374234',
};

export async function signIn(page: Page, email: string, password: string) {
  await page.getByText('Sign In', { exact: true }).click();
  await page.waitForSelector('input[type="email"]');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByText('Sign In', { exact: true }).click();
}

function generateUniqueEmail(prefix: string = 'testuser'): string {
  const timestamp = Date.now();
  return `${prefix}${timestamp}@example.com`;
}

function generateUniquePhoneNumber(): string {
  return '1' + Math.floor(100000000 + Math.random() * 900000000).toString();
}

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

export async function clearAuthData(page: Page) {
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() => sessionStorage.clear());
}

export const loginTestUser = {
  email: 'dawitstudent@gmail.com',
  password: '1qa2ws3ee',
};

export const invalidTestEmail = {
  email: 'invalid',
};
