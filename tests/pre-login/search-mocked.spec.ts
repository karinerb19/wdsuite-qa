import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage.js';
import { PropertyPage } from '../../src/pages/PropertyPage.js';

import {
    AUTOCOMPLETE_RESPONSE,
    PLACE_DETAILS_RESPONSE,
} from '../../src/fixtures/googlePlacesMocks.js';

test.describe('Property Search - Mocked Google Places', () => {

    test.beforeEach(async ({ page }) => {

        // Intercept Google Places autocomplete requests
        await page.route('**/places.googleapis.com/v1/places:autocomplete**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(AUTOCOMPLETE_RESPONSE),
            });
        });

        // Intercept Google Places details request for the selected place
        await page.route('**/places.googleapis.com/v1/places/**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(PLACE_DETAILS_RESPONSE),
            });
        });

    });

    test('search with mocked Google Places shows controlled suggestion', async ({ page }) => {

        const homePage = new HomePage(page);

        await homePage.navigate();
        await homePage.searchForProperty('Beachwalk');
        await homePage.waitForSuggestions();

        await expect(homePage.propertyAddress).toContainText('Beachwalk Apartments');
    });

    test('selecting mocked suggestion navigates to property detail page', async ({ page }) => {
        
        const homePage = new HomePage(page);
        const propertyPage = new PropertyPage(page);

        await homePage.navigate();
        await homePage.searchAndSelectProperty('Beachwalk');

        await expect(page).toHaveURL(/\/property\/lat\/.+\/lng\/.+/);
        await expect(propertyPage.propertyName).toContainText('Beachwalk');
    });

});