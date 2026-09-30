import { type Locator, type Page, expect } from '@playwright/test';
import { parseCurrency } from '../utils/currency';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  itemByName(name: string): Locator {
    return this.cartItems.filter({ hasText: name });
  }

  async quantityOf(name: string): Promise<number> {
    const text = await this.itemByName(name).getByTestId('item-quantity').innerText();
    return Number(text);
  }

  async priceOf(name: string): Promise<number> {
    const text = await this.itemByName(name).getByTestId('inventory-item-price').innerText();
    return parseCurrency(text);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
