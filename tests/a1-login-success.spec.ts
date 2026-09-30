import { test, expect } from '../src/fixtures/pages';
import { users } from '../src/data/users';

test('standard_user logs in and lands on the inventory page with products visible', async ({
  loginPage,
  inventoryPage,
}) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);

  await inventoryPage.expectLoaded();
  await expect(inventoryPage.inventoryItems.first()).toBeVisible();

  const itemCount = await inventoryPage.inventoryItems.count();
  expect(itemCount).toBeGreaterThan(0);
});
