import { Page } from "playwright/test";
import { WAFReportForms } from "./WAFReportForms";
import { Logger } from '../utils/logger';
export class WAFAssessmentsPage {
  private page: Page;
  readonly firstRow = 'div.table-row.attack-item-container';


  constructor(page: Page) {
    this.page = page;
  }

  async selectFirstCompletedRow() {
    try {
      Logger.info('Selecting the first Completed row...');
      const firstRow = this.page.locator(this.firstRow).first();
      await firstRow.click();
      Logger.info('Selected the first Completed row successfully.');

      return new WAFReportForms(this.page);
    } catch (error) {
      console.error('Error selecting the first Completed row:', error);
      throw error;
    }
  }


}