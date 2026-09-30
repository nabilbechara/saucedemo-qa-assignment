import { test, expect } from '../src/fixtures/pages';

const PRODUCT_ONE = 'Sauce Labs Backpack';
const PRODUCT_TWO = 'Sauce Labs Bike Light';

test('adding two products updates the cart badge and cart contents accurately', async ({
  loggedInAsStandardUser,
  cartPage,
}) => {
  const priceOne = await loggedInAsStandardUser.priceOf(PRODUCT_ONE);
  const priceTwo = await loggedInAsStandardUser.priceOf(PRODUCT_TWO);

  await loggedInAsStandardUser.addToCart(PRODUCT_ONE);
  await loggedInAsStandardUser.addToCart(PRODUCT_TWO);
  await loggedInAsStandardUser.expectCartBadgeCount(2);

  await loggedInAsStandardUser.openCart();
  await cartPage.expectLoaded();

  await expect(cartPage.itemByName(PRODUCT_ONE)).toBeVisible();
  await expect(cartPage.itemByName(PRODUCT_TWO)).toBeVisible();

  expect(await cartPage.quantityOf(PRODUCT_ONE)).toBe(1);
  expect(await cartPage.quantityOf(PRODUCT_TWO)).toBe(1);
  expect(await cartPage.priceOf(PRODUCT_ONE)).toBe(priceOne);
  expect(await cartPage.priceOf(PRODUCT_TWO)).toBe(priceTwo);
});
