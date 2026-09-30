import { test, expect } from '../src/fixtures/pages';
import { validCheckoutInfo } from '../src/data/checkout-info';

const PRODUCT = 'Sauce Labs Backpack';

test('completing checkout with valid data shows correct totals and a confirmation', async ({
  loggedInAsStandardUser,
  cartPage,
  checkoutStepOnePage,
  checkoutStepTwoPage,
  checkoutCompletePage,
}) => {
  const itemPrice = await loggedInAsStandardUser.priceOf(PRODUCT);
  await loggedInAsStandardUser.addToCart(PRODUCT);
  await loggedInAsStandardUser.openCart();

  await cartPage.expectLoaded();
  await cartPage.checkout();

  await checkoutStepOnePage.fillInfoAndContinue(validCheckoutInfo);
  await checkoutStepTwoPage.expectLoaded();

  const itemTotal = await checkoutStepTwoPage.getItemTotal();
  const tax = await checkoutStepTwoPage.getTax();
  const total = await checkoutStepTwoPage.getTotal();

  expect(itemTotal).toBeCloseTo(itemPrice, 2);
  expect(total).toBeCloseTo(itemTotal + tax, 2);

  await checkoutStepTwoPage.finish();
  await checkoutCompletePage.expectOrderComplete();
});
