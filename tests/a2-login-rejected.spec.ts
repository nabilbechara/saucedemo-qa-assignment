import { test, expect } from '../src/fixtures/pages';
import { users } from '../src/data/users';

test('locked_out_user is rejected at login with an error and no authenticated access', async ({
  page,
  loginPage,
}) => {
  await loginPage.goto();
  await loginPage.login(users.lockedOut.username, users.lockedOut.password);

  await loginPage.expectLoginRejected(/locked out/i);
  await expect(page).not.toHaveURL(/inventory\.html/);
});
