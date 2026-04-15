import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';
import path from 'path';

// Path where the authenticated session will be saved
const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page, context }) => {

    const loginPage = new LoginPage(page);

    // Navigate to the app homepage
    await page.goto('/');

    // Open the login modal
    await loginPage.openLoginModal();

    // Fill credentials and submit
    await loginPage.login(
        process.env.USER_EMAIL!,
        process.env.USER_PASSWORD!
    );

    // Wait for successful authentication
    await loginPage.waitForAuthenticatedState();

    // Save authenticated session for reuse across logged-in tests
    await context.storageState({ path: authFile });

});