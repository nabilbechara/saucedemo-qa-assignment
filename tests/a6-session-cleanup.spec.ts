import { test, expect } from '../src/fixtures/pages';

test('logging out ends the session and blocks direct access to the inventory page', async ({
  page,
  loggedInAsStandardUser,
  loginPage,
}) => {
  await loggedInAsStandardUser.logout();

  await expect(page).toHaveURL(/saucedemo\.com\/$/);
  await expect(loginPage.loginButton).toBeVisible();

  await page.goto('/inventory.html');

  await expect(page).not.toHaveURL(/inventory\.html/);
  await expect(loginPage.loginButton).toBeVisible();
});

test('each test starts from a fresh, unauthenticated session', async ({ page, loginPage }) => {
  await loginPage.goto();

  await expect(loginPage.loginButton).toBeVisible();
  await expect(page).not.toHaveURL(/inventory\.html/);
});
