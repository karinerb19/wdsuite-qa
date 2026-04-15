import { Page, Locator } from '@playwright/test';

export class BasePage {

    readonly page: Page;

    constructor(page: Page) {
      this.page = page;
    }

    // Navigate to a specific path relative to baseURL
    async navigate(path: string = '/'): Promise<void> {
      await this.page.goto(path);
    }

    // Wait for network to be idle - useful for pages with heavy API calls
    async waitForNetworkIdle(): Promise<void> {
      await this.page.waitForLoadState('networkidle');
    }

    // Wait for a locator to be visible
    async waitForVisible(locator: Locator): Promise<void> {
      await locator.waitFor({ state: 'visible' });
    }

    // Get page title
    async getTitle(): Promise<string> {
      return this.page.title();
    }

    // Check if current URL contains a given string
    urlContains(substring: string): boolean {
      return this.page.url().includes(substring);
    }

}