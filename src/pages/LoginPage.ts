import { Page } from '@playwright/test';
import { DashboardsPage } from './DashboardsPage';

export class LoginPage {
  private page: Page;

  // Selectors
  readonly emailInput = 'input[test-id="email"]';
  readonly passwordInput = 'input[test-id="password"]';
  readonly signInButton = 'button[test-id="sign-in"]';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    try {
      console.log('Navigating to login page...');
      await this.page.goto('/login');
      console.log('Navigation to login page successful.');
    } catch (error) {
      console.error('Error navigating to login page:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<DashboardsPage> {
    try {
      console.log('Filling in login credentials...');
      await this.page.fill(this.emailInput, email);
      await this.page.fill(this.passwordInput, password);
      console.log('Clicking on the Sign In button...');
      await this.page.click(this.signInButton);
      console.log('Login successful.');
      return new DashboardsPage(this.page);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
}
