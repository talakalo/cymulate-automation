import { Page } from '@playwright/test';
import { ReportsPage } from './ReportsPage';

export class DashboardsPage {
  private page: Page;

  // Selector for the Reports tab
  readonly reportsTab = '[data-testid="link-button-Reports"]';
readonly loader = '.wrapperDotFalling';
  constructor(page: Page) {
    this.page = page;
  }

  async clickOnReportTab(): Promise<ReportsPage> {
    try {
      console.log('Waiting for the loader to disappear...');
      await this.page.waitForSelector(this.loader, { state: 'hidden' }); // Ensures the loader is no longer visible

      console.log('Clicking on the Reports tab...');
      await this.page.click(this.reportsTab);
      console.log('Navigated to the Reports page successfully.');
      return new ReportsPage(this.page);
    } catch (error) {
      console.error('Error clicking on the Reports tab:', error);
      throw error;
    }
  }
}
