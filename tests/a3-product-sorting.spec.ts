import { test, expect } from '../src/fixtures/pages';
import { isAscending } from '../src/utils/sorting';

test('sorting by price low to high orders every displayed price ascending', async ({
  loggedInAsStandardUser,
}) => {
  const prices = await loggedInAsStandardUser.sortByPriceLowToHigh();

  expect(prices.length).toBeGreaterThan(0);
  expect(isAscending(prices)).toBe(true);
});
