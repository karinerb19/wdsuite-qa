import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {

    readonly searchInput: Locator;
    readonly suggestedAddresses: Locator;
    readonly firstPropertyItem: Locator;
    readonly propertyAddress: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByTestId('searchInput');
        this.suggestedAddresses = page.getByTestId('suggestedAddresses');
        this.firstPropertyItem = page.getByTestId('propertyItem').first();
        this.propertyAddress = this.firstPropertyItem.getByTestId('propertyAddress');
    }

    async navigate(): Promise<void> {
        await this.page.goto('/');
    }

    async isSearchInputVisible(): Promise<boolean> {
        return this.searchInput.isVisible();
    }

    async searchForProperty(query: string): Promise<void> {
        await this.searchInput.pressSequentially(query, { delay: 100 });
    }

    async waitForSuggestions(): Promise<void> {
         await this.suggestedAddresses.waitFor({ state: 'visible' });
    }

    async selectFirstSuggestion(): Promise<void> {
        await this.firstPropertyItem.click();
    }

    async searchAndSelectProperty(query: string): Promise<void> {
        await this.searchForProperty(query);
        await this.waitForSuggestions();
        await this.selectFirstSuggestion();
    }

    async getFirstSuggestionText(): Promise<string> {
        return this.propertyAddress.innerText();
    }



}