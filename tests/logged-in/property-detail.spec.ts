import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage.js';
import { PropertyPage } from '../../src/pages/PropertyPage.js';
import { PROPERTIES } from '../../test-data/testData.js';

test.describe('Property Detail - Logged In', () => {

    test('authenticated user can navigate to property detail page', async ({ page }) => {
        const homePage = new HomePage(page);
        const propertyPage = new PropertyPage(page);

        await homePage.navigate();
        await homePage.searchAndSelectProperty(PROPERTIES.OCEANVIEW_TOWERS);

        await expect(page).toHaveURL(/\/property\/lat\/.+\/lng\/.+/);
        await expect(propertyPage.propertyName).toContainText(PROPERTIES.OCEANVIEW_TOWERS);
    });

    test('tenant credit score is visible for authenticated user', async ({ page }) => {
        const homePage = new HomePage(page);
        const propertyPage = new PropertyPage(page);

        await homePage.navigate();
        await homePage.searchAndSelectProperty(PROPERTIES.OCEANVIEW_TOWERS);

        await expect(propertyPage.tenantCreditCards).toBeVisible();
        await expect(propertyPage.tenantCardTitle).toContainText(PROPERTIES.OCEANVIEW_TOWERS);
        await expect(propertyPage.qualityScore).toBeVisible();
        await expect(propertyPage.creditValue).toBeVisible();
        await expect(propertyPage.progressBar).toBeVisible();
    });

});