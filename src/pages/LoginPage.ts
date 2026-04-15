import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {

    readonly loginButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly hamburgerMenu: Locator;

    constructor(page: Page) {
        super(page);
        this.loginButton = page.getByTestId('login-button');
        this.emailInput = page.getByTestId('userEmail');
        this.passwordInput = page.getByTestId('userPassword');
        this.signInButton = page.getByTestId('signInButton');
        this.hamburgerMenu = page.getByTestId('hamburgerMenu');
    }

    async openLoginModal(): Promise<void> {
        await this.loginButton.click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async waitForAuthenticatedState(): Promise<void> {
        await expect(this.hamburgerMenu).toBeVisible();
    }

    async clickHamburgerMenu(): Promise<void> {
        await this.hamburgerMenu.click();
    }

}