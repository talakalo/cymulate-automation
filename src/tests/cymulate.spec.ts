import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ReportsPage } from '../pages/ReportsPage';
import { DashboardsPage } from '../pages/DashboardsPage';
import { DownloadHelper } from '../utils/DownloadHelper';
import { loginTestData } from '../testData/data';
import * as path from 'path';
import * as fs from 'fs';
import { WAFAssessmentsPage } from '../pages/WAFAssessmentsPage';
import { WAFReportForms } from '../pages/WAFReportForms';
import { DownloadManager } from '../pages/DownloadManager';

test.describe('Cymulate QA Automation', () => {
  let reportsPage: ReportsPage;
  let dashboardsPage: DashboardsPage;
  let wafPage: WAFAssessmentsPage;
  let wafReportForms: WAFReportForms;
  let downloadManagerPopup: DownloadManager;

  const credentials = {
    email: loginTestData.user.username,
    password: loginTestData.user.password,
  };

  const downloadDir = path.resolve(__dirname, '../downloads');
  const expectedWAFUrl = 'https://ekslabs.cymulatedev.com';
  const expectedStatus = 'Completed';
  const expectedScore = '29';
  const expectedFileContent = 'https://ekslabs.cymulatedev.com\\Program Files\\Apache Group\\Apache\\logs\\error.log';
  let downloadHelper: DownloadHelper;
  test.beforeEach(async ({ page }) => {
    console.log('Setting up environment...');
    downloadHelper = new DownloadHelper(downloadDir);
    downloadHelper.clearDownloadDir();
    await page.context().newCDPSession(page).then(client =>
      client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadDir, // Set the desired download directory
      })
    );
    console.log('Environment setup completed.');
  });

  test('Validate report details and download CSV', async ({ page }) => {
    const loginPage = new LoginPage(page);
    downloadHelper= new DownloadHelper(downloadDir);
    try {
      console.log('Starting test: Validate report details and download CSV...');

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

      await test.step('Generate and CSV report', async () => {
        await wafReportForms.downloadCSV();
        wafReportForms.validateReportDownloadToast()
      });

      await test.step('Download and validate the CSV report', async () => {
        
        downloadManagerPopup = new DownloadManager(page);

        await downloadManagerPopup.openDownloadManagerPopup();

        const [download] = await Promise.all([
          page.waitForEvent('download'),
          downloadManagerPopup.clickDownloadButton(),

        ]);
        // downloadManagerPopup.validateAndDownloadReport(expectedFileContent)
        downloadHelper.validateFileContent(downloadDir,"web_application_firewall_csv_report",expectedFileContent);

      });

      console.log('Test completed successfully.');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
