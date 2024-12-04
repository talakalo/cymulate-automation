import { Page } from '@playwright/test';
import { DashboardsPage } from './DashboardsPage';
import { Logger } from '../utils/logger';

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
      Logger.info('Navigating to login page...');
      await this.page.goto('/login');
    } catch (error) {
      Logger.error('Error navigating to login page:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<DashboardsPage> {
    try {
      if (email && password) {
        Logger.info('Filling in login credentials...');
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.passwordInput, password);
        Logger.info('Clicking on the Sign In button...');
        await this.page.click(this.signInButton);
        Logger.info('Login successful.');
        return new DashboardsPage(this.page);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      Logger.error('Error during login:', error);
      throw error;
    }
  }
}
