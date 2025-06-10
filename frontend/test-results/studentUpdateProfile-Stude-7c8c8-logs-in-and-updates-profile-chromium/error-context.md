# Test info

- Name: Student Update Profile >> student logs in and updates profile
- Location: C:\Users\dagim\Desktop\capstoneProject\frontend\tests\studentUpdateProfile.spec.ts:27:7

# Error details

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByText(/Profile|Edit Profile/i).first()
    - locator resolved to <div dir="auto" class="css-text-146c3p1 font-psemibold text-xs w-20 text-center">Profile</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div dir="auto" class="css-text-146c3p1 font-psemibold text-xs w-20 text-center">Profile</div> from <div class="css-view-175oi2r r-alignItems-1awozwy r-alignSelf-1kihuf0 r-height-1pi2tsx r-justifyContent-1777fci r-position-u8s1d r-width-13qz1uu">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div dir="auto" class="css-text-146c3p1 font-psemibold text-xs w-20 text-center">Profile</div> from <div class="css-view-175oi2r r-alignItems-1awozwy r-alignSelf-1kihuf0 r-height-1pi2tsx r-justifyContent-1777fci r-position-u8s1d r-width-13qz1uu">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    53 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div dir="auto" class="css-text-146c3p1 font-psemibold text-xs w-20 text-center">Profile</div> from <div class="css-view-175oi2r r-alignItems-1awozwy r-alignSelf-1kihuf0 r-height-1pi2tsx r-justifyContent-1777fci r-position-u8s1d r-width-13qz1uu">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

    at C:\Users\dagim\Desktop\capstoneProject\frontend\tests\studentUpdateProfile.spec.ts:33:59
```

# Page snapshot

```yaml
- text: Cognify  Fri, May 30 Welcome back! 👋 Ready to learn something new today? My Division Diamond III  250 points to next division 1750 / 2000 Quick Actions  Exam  News  Search  Customize Daily Tasks View All Chemistry Due Nov 14 Complete 15 questions Biology Due Nov 12 Complete 15 questions Mathematics Due Nov 13 Complete 15 questions
- tablist: Home Home Question Question Notification Notification Profile Profile
- img
```

# Test source

```ts
   1 | import { test, expect, Page } from '@playwright/test';
   2 | import { signIn, clearAuthData } from './helpers/auth.helper';
   3 |
   4 | // Credentials for the student
   5 | const studentEmail = 'Adonai@gmail.com'; // Replace with a real student email
   6 | const studentPassword = 'Adonai'; // Replace with the real password
   7 |
   8 | async function waitForPageLoad(page: Page) {
   9 |   await page.waitForTimeout(1000);
  10 | }
  11 |
  12 | async function continueWithEmail(page: Page) {
  13 |   const continueDiv = page.getByText(/Continue With Email/i);
  14 |   await continueDiv.waitFor({ state: 'visible', timeout: 10000 });
  15 |   await continueDiv.click();
  16 | }
  17 |
  18 | test.describe('Student Update Profile', () => {
  19 |   test.setTimeout(60000);
  20 |
  21 |   test.beforeEach(async ({ page }) => {
  22 |     await page.goto('http://localhost:8081', { timeout: 60000 });
  23 |     await clearAuthData(page);
  24 |     await waitForPageLoad(page);
  25 |   });
  26 |
  27 |   test('student logs in and updates profile', async ({ page }) => {
  28 |     await continueWithEmail(page);
  29 |     await signIn(page, studentEmail, studentPassword);
  30 |     await expect(page).toHaveURL(/\/student\/Home/);
  31 |
  32 |     // Navigate to Edit Profile tab/screen
> 33 |     await page.getByText(/Profile|Edit Profile/i).first().click();
     |                                                           ^ Error: locator.click: Test timeout of 60000ms exceeded.
  34 |     await expect(page.getByText(/Edit Profile|Update Profile/i)).toBeVisible();
  35 |
  36 |     // Fill in the profile update form (adjust selectors as needed)
  37 |     await page.getByPlaceholder('Full Name').fill('Updated Student Name');
  38 |     await page.getByPlaceholder('Phone Number').fill('1234567890');
  39 |     // Add more fields as needed
  40 |
  41 |     // Submit the form
  42 |     await page.getByRole('button', { name: /Update|Save/i }).click();
  43 |
  44 |     // Assert success message or updated value
  45 |     await expect(page.getByText(/Profile updated successfully|Success/i)).toBeVisible();
  46 |   });
  47 | });
  48 |
```