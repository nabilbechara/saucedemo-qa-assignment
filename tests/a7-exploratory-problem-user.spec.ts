import { test, expect } from '../src/fixtures/pages';
import { users } from '../src/data/users';
import { isAscending } from '../src/utils/sorting';

test('problem_user: selecting "Price (low to high)" does not reorder the product list', async ({
  loginPage,
  inventoryPage,
}) => {
  await loginPage.goto();
  await loginPage.login(users.problem.username, users.problem.password);
  await inventoryPage.expectLoaded();

  const beforeSort = await inventoryPage.getDisplayedPrices();
  await inventoryPage.sortDropdown.selectOption('lohi');
  const afterSort = await inventoryPage.getDisplayedPrices();

  // Documents the defect described in BUG_REPORT.md: the list order is unchanged
  // and is not ascending, even though "Price (low to high)" was selected.
  expect(afterSort).toEqual(beforeSort);
  expect(isAscending(afterSort)).toBe(false);
});
