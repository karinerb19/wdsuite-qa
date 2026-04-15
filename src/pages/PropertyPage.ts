import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class PropertyPage extends BasePage {

    readonly propertyName: Locator;
    readonly tenantCreditCards: Locator;
    readonly tenantCardTitle: Locator;
    readonly qualityScore: Locator;
    readonly creditValue: Locator;
    readonly progressBar: Locator;

    readonly saveToDashboardButton: Locator;
    readonly savedPropertyActionButton: Locator;
    readonly savedPropertyOption: Locator;
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;
    readonly toastTitle: Locator;
    readonly toastCloseButton: Locator;
   
    readonly propertyDetailsTable: Locator;
    readonly propertyDetailsAddressValue: Locator;

    constructor(page: Page) {
        super(page);
        this.propertyName = page.getByTestId('propertyName');
        this.tenantCreditCards = page.getByTestId('tenantCreditCards');
        this.tenantCardTitle = page.getByTestId('tenantCardTitle');
        this.qualityScore = page.getByTestId('qualityScore');
        this.creditValue = page.getByTestId('creditValue');
        this.progressBar = page.getByTestId('progressBar');

        this.saveToDashboardButton = page
        .getByTestId('userPropertyStatusSaveButton').filter({ visible: true });

        this.savedPropertyActionButton = page
        .getByTestId('userPropertyStatusActionButton').filter({ visible: true });
        
        this.savedPropertyOption = page.getByTestId('userPropertiesSaveSavedProperty');
        this.confirmButton = page.getByTestId('userPropertiesSaveConfirm');
        this.cancelButton = page.getByTestId('userPropertiesSaveCancel');
        this.toastTitle = page.getByTestId('toastTitle');
        this.toastCloseButton = page.getByTestId('toastClose');

        this.propertyDetailsTable = page.getByTestId('propertyDetailsTable');
        this.propertyDetailsAddressValue = this.propertyDetailsTable
        .getByTestId('propertyDetailsValueCell')
        .first(); // Address is always the first row

    }

    async getPropertyAddress(): Promise<string> {
        return this.propertyDetailsAddressValue.innerText();
    }

    async saveToDashboard(): Promise<boolean> {

          // If already saved, skip — property is already in the desired state
        const isAlreadySaved = await this.savedPropertyActionButton.isVisible();

        if(!isAlreadySaved) {
            await this.saveToDashboardButton.click();
            await this.savedPropertyOption.click();
            await this.confirmButton.click();
            return true; // Indicate that a save action was performed
        }else{
            return false; // Indicate that the property was already saved, no action taken
        }

    }

}