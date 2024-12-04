import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ReportsPage } from '../pages/ReportsPage';
import { DashboardsPage } from '../pages/DashboardsPage';
import { DownloadHelper } from '../utils/DownloadHelper';
import { loginTestData } from '../testData/data';
import * as path from 'path';
import { WAFAssessmentsPage } from '../pages/WAFAssessmentsPage';
import { WAFReportForms } from '../pages/WAFReportForms';
import { DownloadManager } from '../pages/DownloadManager';
import { Logger } from '../utils/logger';
import { BrowserManager } from '../utils/browserManager';

test.describe('generate report and download CSV flow', () => {
  let dashboardsPage: DashboardsPage;
  let reportsPage: ReportsPage;
  let wafPage: WAFAssessmentsPage;
  let wafReportForms: WAFReportForms;
  let downloadManagerPopup: DownloadManager;
  let browserManager: BrowserManager;
  let downloadHelper: DownloadHelper;

  const downloadDir = path.resolve(__dirname, '../downloads');
  const credentials = {
    email: loginTestData.user.username!,
    password: loginTestData.user.password!,
  };
  const expectedWAFUrl = 'https://ekslabs.cymulatedev.com';
  const expectedStatus = 'Completed';
  const expectedScore = '29';
  const expectedFileContent =
    'https://ekslabs.cymulatedev.com\\Program Files\\Apache Group\\Apache\\logs\\error.log';

  test.beforeAll(async () => {
    browserManager = new BrowserManager();
    await browserManager.initialize();
    downloadHelper = new DownloadHelper(downloadDir);
  });

  test.afterAll(async () => {
    await browserManager.tearDown();
  });

  test.beforeEach(async () => {
    downloadHelper.clearDownloadDir();
    Logger.info('Setup environment completed.');
  });

  test('Validate report details and download CSV', async () => {
    const page = browserManager.getPage();
    const loginPage = new LoginPage(page);

    try {
      Logger.info('Starting test: Validate report details and download CSV...');

      await test.step('Log in with valid credentials', async () => {
        dashboardsPage = await loginPage.navigate().then(() =>
          loginPage.login(credentials.email, credentials.password)
        );
      });

      await test.step('Go to the report tab -> Web Application Firewall -> History', async () => {
        reportsPage = await dashboardsPage.clickOnReportTab();
        wafPage = await reportsPage.navigateToWAFHistory();
      });

      await test.step('Select first completed row in WAF assessments', async () => {
        wafReportForms = await wafPage.selectFirstCompletedRow();
      });

      await test.step('Validate WAF report details', async () => {
        await wafReportForms.validateWAFUrl(expectedWAFUrl);
        await wafReportForms.validateAssessmentStatus(expectedStatus);
        await wafReportForms.validateOverallScore(expectedScore);
      });

      await test.step('Generate and Download CSV report', async () => {
        await wafReportForms.generateReport();

        downloadManagerPopup = new DownloadManager(page);
        await downloadManagerPopup.openDownloadManagerPopup();

        const [download] = await Promise.all([
          page.waitForEvent('download'),
          downloadManagerPopup.clickDownloadButton(),
        ]);

        downloadHelper.validateFileContent(downloadDir, 'web_application_firewall_csv_report', expectedFileContent);
      });

      Logger.info('Test completed successfully.');
    } catch (error) {
      Logger.error('Test failed:', error);
      throw error;
    }
  });
});
