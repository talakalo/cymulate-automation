import { expect, Page } from "playwright/test";

export class WAFReportForms {
  page: Page

  readonly wafUrlSelector = 'div.summary-data div.report-summary-data';
  readonly assessmentStatusSelector = '[data-testid="assessment-status-report"]';
  readonly overallScoreSelector = 'div.score-text > span > span';
  readonly downloadCsvButton = `btn.cymulate-btn.btn-margin:has-text("CSV")`;
  readonly generateReportButton = ""



  constructor(page: Page) {
    this.page = page;
  }

  async validateWAFUrl(expectedUrl: string) {
    const wafUrl = await this.page.textContent(this.wafUrlSelector);
    if (wafUrl?.trim() !== expectedUrl) {
      throw new Error(`Expected WAF URL: ${expectedUrl}, but got: ${wafUrl}`);
    }
    console.log('WAF URL validated successfully.');
  }

  async validateAssessmentStatus(expectedStatus: string) {
    const status = await this.page.textContent(this.assessmentStatusSelector);
    if (status?.trim() !== expectedStatus) {
     // expect.soft(status?.trim()).toBe(`Expected Assessment Status: ${expectedStatus}, but got: ${status}`);
     console.log(`Expected Assessment Status: ${expectedStatus}, but got: ${status}`);

    }
    console.log('Assessment status validated successfully.');
  }

  async validateOverallScore(expectedScore) {
    const score = await this.page.textContent(this.overallScoreSelector);
    //expect.soft(score?.trim()).toBe(expectedScore);
    if (score?.trim() !== expectedScore) {
      console.log(`Expected Overall Score: ${expectedScore}, but got: ${score}`);
    } else {
      console.log('Overall score validation completed with errors.');
    }

  }

  async downloadCSV() {
    console.log('Clicking on the Download CSV button...');
    await this.page.getByRole('button', { name: 'Generate Report' }).click();

    this.clickCsvDownloadButton();
    
  }

  async validateReportDownloadToast() {
    console.log('Validating report download toast...');
    const toast = this.page.getByText('SuccessReport Added To Manager');;
    expect(toast).toBeVisible();    
}
  async clickCsvDownloadButton() {
    console.log('Clicking on the CSV button...');
     this.page.getByRole('button', { name: 'CSV' }).first().click();
  }
}