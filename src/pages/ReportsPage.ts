import { Page } from '@playwright/test';
import { WAFAssessmentsPage } from './WAFAssessmentsPage';
import { Logger } from '../utils/logger';
export class ReportsPage {
  private page: Page;

  // Selectors
  readonly wafModule = 'div[data-module="waf"]';
  readonly historyButton = 'a[href^="/cym/waf_reports/"] > div.btn-cymulate.empty';
  constructor(page: Page) {
    this.page = page;
  }



  async navigateToWAFHistory() {
    try {
      Logger.info('Locating Web Application Firewall module...');
      await this.page.locator(this.wafModule).scrollIntoViewIfNeeded();
      Logger.info('Clicking on the History button...');
      await this.page.click(this.historyButton);
      Logger.info('Navigated to WebA pplication Firewall Assessments Page successfully.');
      return new WAFAssessmentsPage(this.page);
    } catch (error) {
      console.error('Error navigating to WAF History:', error);
      throw error;
    }
  }
}
