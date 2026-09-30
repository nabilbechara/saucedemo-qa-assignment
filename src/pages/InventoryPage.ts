import { type Locator, type Page, expect } from '@playwright/test';
import { parseCurrency } from '../utils/currency';
import { isAscending } from '../utils/sorting';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly itemPrices: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.sortDropdown = page.getByLabel('Sort products');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  itemByName(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  async addToCart(productName: string): Promise<void> {
    await this.itemByName(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async priceOf(productName: string): Promise<number> {
    const text = await this.itemByName(productName).getByTestId('inventory-item-price').innerText();
    return parseCurrency(text);
  }

  async getDisplayedPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map(parseCurrency);
  }

  async sortByPriceLowToHigh(): Promise<number[]> {
    await this.sortDropdown.selectOption('lohi');
    await expect(async () => {
      expect(isAscending(await this.getDisplayedPrices())).toBe(true);
    }).toPass({ timeout: 5000 });
    return this.getDisplayedPrices();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
