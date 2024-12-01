import { Page } from '@playwright/test';
import { WAFAssessmentsPage } from './WAFAssessmentsPage';

export class ReportsPage {
  private page: Page;

  // Selectors
   // Selectors
  readonly wafModule = 'div[data-module="waf"]';
  readonly historyButton = 'a[href^="/cym/waf_reports/"] > div.btn-cymulate.empty';
  constructor(page: Page) {
    this.page = page;
  }



 async navigateToWAFHistory() {
   try {
     console.log('Locating Web Application Firewall module...');
     await this.page.locator(this.wafModule).scrollIntoViewIfNeeded();
     console.log('Clicking on the History button...');
     await this.page.click(this.historyButton);
     console.log('Navigated to WebA pplication Firewall Assessments Page successfully.');
     return new WAFAssessmentsPage(this.page);
   } catch (error) {
     console.error('Error navigating to WAF History:', error);
     throw error;
   }
 }
}
