import { Page } from "playwright/test";
import { WAFReportForms } from "./WAFReportForms";

export class WAFAssessmentsPage {
    private page: Page;

  
    private firstRow = 'div.table-row.attack-item-container';
  
  
    constructor( page: Page) {
      this.page = page;
    }  

  async selectFirstCompletedRow() {
    try {
      console.log('Selecting the first Completed row...');
      const firstRow = await this.page.locator(this.firstRow).first();
      await firstRow.click();
      console.log('Selected the first Completed row successfully.');

      return new WAFReportForms(this.page);
    } catch (error) {
      console.error('Error selecting the first Completed row:', error);
      throw error;
    }
  }
        

}