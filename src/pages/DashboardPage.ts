import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {

    readonly dashboardLink: Locator;
    readonly userPropertiesTable: Locator;
    readonly propertyRows: Locator;

    constructor(page: Page) {
        super(page);
        this.dashboardLink = page.getByTestId('dashboardLink');
        this.userPropertiesTable = page.getByTestId('userPropertiesTable');
        this.propertyRows = page.getByTestId('userPropertyRow');
    }

    async navigateToDashboard(): Promise<void> {
        await this.dashboardLink.click();
    }

    async isPropertySaved(address: string): Promise<boolean> {

        const rowCount = await this.propertyRows.count();

        // Use only street address fragment to handle format differences between pages
        const addressFragment = address.split(',')[0].trim();

        for (let i = 0; i < rowCount; i++) {
            const row = this.propertyRows.nth(i);
            const rowAddress = (await row.getByTestId('propertyAddress').innerText()).trim();
            //row.getByTestId('propertyAddress');
            if (rowAddress.includes(addressFragment)) {
                const status = (await row.getByTestId('propertyStatus').innerText()).trim();
                return status === 'Saved';
            }
        }
        return false;
    }

    async waitForPropertiesLoaded(): Promise<void> {
        await this.propertyRows.first().waitFor({ state: 'visible' });
    }

}