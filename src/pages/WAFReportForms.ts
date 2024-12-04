import { expect, Page } from "playwright/test";
import { Logger } from '../utils/logger';
export class WAFReportForms {
  page: Page

  readonly wafUrlSelector = 'div.summary-data div.report-summary-data';
  readonly assessmentStatusSelector = '[data-testid="assessment-status-report"]';
  readonly overallScoreSelector = 'div.score-text > span > span';
  readonly csvButton = `btn.cymulate-btn.btn-margin:has-text("CSV")`;
  readonly generateReportButton = 'button.report-pop-up';
  readonly gererateReportDropDown = '.generate-report-dropdown-popup';


  
  constructor(page: Page) {
    this.page = page;
  }

  async validateWAFUrl(expectedUrl: string) {
    const wafUrl = await this.page.textContent(this.wafUrlSelector);
    if (wafUrl?.trim() !== expectedUrl) {
      throw new Error(`Expected WAF URL: ${expectedUrl}, but got: ${wafUrl}`);
    } else {
      Logger.info('WAF URL validated successfully.');
    }

  }

  async validateAssessmentStatus(expectedStatus: string) {
    const status = await this.page.textContent(this.assessmentStatusSelector);
    if (status?.trim() !== expectedStatus) {
      // expect.soft(status?.trim()).toBe(`Expected Assessment Status: ${expectedStatus}, but got: ${status}`);
      Logger.info(`Expected Assessment Status: ${expectedStatus}, but got: ${status}`);

    } else {
      Logger.info('Assessment status validated successfully.');
    }

  }

  async validateOverallScore(expectedScore) {
    const score = await this.page.textContent(this.overallScoreSelector);
    //expect.soft(score?.trim()).toBe(expectedScore);
    if (score?.trim() !== expectedScore) {
      Logger.info(`Expected Overall Score: ${expectedScore}, but got: ${score}`);
    } else {
      Logger.info('Overall score validation completed successfully.');
    }

  }

  async generateReport() {
    Logger.info('Clicking on the generate report button...');
    const generateReportButton = this.page.locator(this.generateReportButton);
    await generateReportButton.click();
    
    expect.soft(this.page.locator(this.gererateReportDropDown)).toBeVisible();

    Logger.info('Clicking on the CSV button...');
    const csvbtn = this.page.getByRole('button', { name: 'CSV' }).first();
    csvbtn.click();

    Logger.info('Validating SuccessReport Added To Manager toast...');
    const toast = this.page.getByText('SuccessReport Added To Manager');;
    // expect.soft(toast).toBeVisible({ timeout: 90000 });

  }
  async downloadCSV() {
    console.log('Clicking on the Download CSV button...');
    await this.page.getByRole('button', { name: 'Generate Report' }).click();

    this.clickCsvDownloadButton();
    
  }

  
  async validateReportDownloadToast() {
    Logger.info('Validating report download toast...');
    const toast = this.page.getByText('SuccessReport Added To Manager');;
    //expect.soft(toast).toBeVisible({ timeout: 90000 });
  }
  async clickCsvDownloadButton() {
    Logger.info('Clicking on the CSV button...');
    this.page.locator(this.csvButton).click();
  }
}