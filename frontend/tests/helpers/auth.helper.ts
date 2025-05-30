import { Page } from '@playwright/test';

export const testUser = {
  email: 'test@example.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '1234567890',
  grade: '12',
  stream: 'NaturalScience',
};

export async function signIn(page: Page, email: string, password: string) {
  await page.getByText('Sign In', { exact: true }).click();
  await page.waitForSelector('input[type="email"]');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByText('Sign In', { exact: true }).click();
}

export async function signUpAsStudent(page: Page, userData: typeof testUser) {
  // Wait for the form to be visible
  await page.waitForSelector('input[placeholder="Enter your first name"]', { timeout: 10000 });
  
  // Fill in the form fields using more specific selectors
  await page.getByPlaceholder('Enter your first name').fill(userData.firstName);
  await page.getByPlaceholder('Enter your last name').fill(userData.lastName);
  await page.locator('#Email').fill(userData.email);
  await page.locator('#Password').fill(userData.password);
  await page.getByPlaceholder('Enter your phone number').fill(userData.phoneNumber);

  // Handle grade selection
  await page.getByText('Select Grade').click();
  await page.getByText(userData.grade, { exact: true }).click();

  
  // Handle stream selection
  await page.getByText(userData.stream, { exact: true }).click();

  // Submit the form
  await page.locator('#SignUpButton').click();

}

export async function signUpAsTeacher(page: Page, userData: typeof testUser) {
  
  await page.getByPlaceholder('Enter your first name').fill(userData.firstName);
  await page.getByPlaceholder('Enter your last name').fill(userData.lastName);
  await page.locator('#Email').fill(userData.email);
  await page.locator('#Password').fill(userData.password);
  await page.getByPlaceholder('Enter your phone number').fill(userData.phoneNumber);
  
  await page.locator('#SignUpButton').click();
}

export async function clearAuthData(page: Page) {
  // Clear localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  // Clear sessionStorage
  await page.evaluate(() => {
    sessionStorage.clear();
  });
} 

export const loginTestUser = {
  email: 'dawitstudent@gmail.com',
  password: '1qa2ws3ee', 
};

export const invalidTestEmail =  {
  email : "invalid"
}