import { type Locator, type Page, expect } from '@playwright/test';
import { parseCurrency } from '../utils/currency';

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
  }

  async getItemTotal(): Promise<number> {
    return parseCurrency(await this.subtotalLabel.innerText());
  }

  async getTax(): Promise<number> {
    return parseCurrency(await this.taxLabel.innerText());
  }

  async getTotal(): Promise<number> {
    return parseCurrency(await this.totalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
