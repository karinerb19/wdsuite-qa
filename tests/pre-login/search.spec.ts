import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage.js';
import { PropertyPage } from '@pages/PropertyPage.js';
import { PROPERTIES, SEARCH_TEST_CASES } from '../../test-data/testData.js';


test.describe('Property Search - Pre Login', () => {

    test('searching for a property shows autocomplete suggestions', async ({ page }) => {

        const homePage = new HomePage(page);

        await homePage.navigate();
        await homePage.searchForProperty(PROPERTIES.BEACHWALK_APARTMENTS);
        await homePage.waitForSuggestions();

        await expect(homePage.propertyAddress).toContainText('Beachwalk');
    });

    for(const {query, expectedName} of SEARCH_TEST_CASES) {

        test(`selecting "${query}" navigates to property detail page`, async ({ page }) => {

            const homePage = new HomePage(page);
            const propertyPage = new PropertyPage(page);

            await homePage.navigate();
            await homePage.searchAndSelectProperty(query);
            await expect(page).toHaveURL(/\/property\/lat\/.+\/lng\/.+/);
            await expect(propertyPage.propertyName).toContainText(expectedName);

        });

    }

});