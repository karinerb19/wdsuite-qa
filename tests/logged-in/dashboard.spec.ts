import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage.js';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { PropertyPage } from '../../src/pages/PropertyPage.js';
import { DashboardPage } from '../../src/pages/DashboardPage.js';
import { MyPropertiesAPI } from '../../src/api/MyPropertiesAPI.js';
import { PROPERTIES } from '../../test-data/testData.js';

test.describe('Dashboard - Logged In', () => {


    test.beforeEach(async ({ page, request }) => {

        // Clean state — delete all saved properties before test
        const myPropertiesAPI = new MyPropertiesAPI(request);
        await myPropertiesAPI.deleteAllProperties();

    });



    test.afterEach(async ({ request }) => {
        // Cleanup — delete all saved properties after test
        const myPropertiesAPI = new MyPropertiesAPI(request);
        await myPropertiesAPI.deleteAllProperties();
    });

    test('saved property appears on dashboard', async ({ page, request }) => {

        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);
        const propertyPage = new PropertyPage(page);
        const dashboardPage = new DashboardPage(page);

        // Navigate to property and save it
        await homePage.navigate();
        await homePage.searchAndSelectProperty(PROPERTIES.BEACHWALK_APARTMENTS);

        // Capture address from property details table before saving
        const propertyAddress = await propertyPage.getPropertyAddress();


        const saveResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/my-properties/') &&
                response.request().method() === 'PUT' &&
                response.status() === 200
        );

        // Click Save to Dashboard button 
        await propertyPage.saveToDashboardButton.click();
        // Complete the save flow
        await propertyPage.savedPropertyOption.click();
        await propertyPage.confirmButton.click();

        // Wait for backend to confirm save before navigating
        await saveResponsePromise;

        // Verify toast confirmation
        await expect(propertyPage.toastTitle).toContainText('Property added to Saved Properties');
        await propertyPage.toastCloseButton.click();


        // Navigate to dashboard
        await loginPage.clickHamburgerMenu();
        await dashboardPage.navigateToDashboard();
        await expect(page).toHaveURL(/\/dashboard/);

        // Verify property appears in dashboard table
        await expect(dashboardPage.userPropertiesTable).toBeVisible();
        await dashboardPage.waitForPropertiesLoaded();
        const isPresentInDashboard = await dashboardPage.isPropertySaved(propertyAddress);
        expect(isPresentInDashboard).toBeTruthy();
    });

});