import { Page } from "playwright/test";

export class WAFReportForms {
     page: Page

    readonly wafUrlSelector = 'div.summary-data div.report-summary-data';
    readonly assessmentStatusSelector = '[data-testid="assessment-status-report"]';
    readonly overallScoreSelector = 'div.score-text > span > span';
    readonly downloadCsvButton = 'div.pdf-button button';
  
    constructor( page: Page) {
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
        throw new Error(`Expected Assessment Status: ${expectedStatus}, but got: ${status}`);
      }
      console.log('Assessment status validated successfully.');
    }
  
    async validateOverallScore(expectedScore: string) {
      const score = await this.page.textContent(this.overallScoreSelector);
      if (score?.trim() !== expectedScore) {
        throw new Error(`Expected Overall Score: ${expectedScore}, but got: ${score}`);
      }
      console.log('Overall score validated successfully.');
    }
  
    async downloadCSV() {
      console.log('Clicking on the Download CSV button...');
      await this.page.click(this.downloadCsvButton);
      console.log('Download CSV initiated.');
    }
  
}