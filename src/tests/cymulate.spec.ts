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

  test.beforeEach(async ({ page }) => {
    console.log('Setting up environment...');
    const downloadHelper = new DownloadHelper(downloadDir);
    downloadHelper.clearDownloadDir();
    await page.context().newCDPSession(page).then((client) =>
      client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadDir,
      })
    );
    console.log('Environment setup completed.');
  });

  test('Validate report details and download CSV', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const downloadHelper = new DownloadHelper(downloadDir);

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

      // await test.step('Download and validate the CSV report', async ({ page }) => {
      //   downloadManagerPopup = new DownloadManager(page);
      //   await downloadManagerPopup.clickDownloadButton();

      //   // Wait for file to appear in the downloads directory
      //   const files = fs.readdirSync(downloadDir);
      //   console.log('Files in download directory:', files);

      //   const csvFile = files.find(file => file.endsWith('.csv'));
      //   if (!csvFile) {
      //     throw new Error('CSV file not found in downloads directory.');
      //   }

      //   const filePath = path.join(downloadDir, csvFile);
      //   console.log(`Validating file content for file: ${filePath}...`);

      //   const fileContent = fs.readFileSync(filePath, 'utf-8');
      //   if (!fileContent.includes(expectedFileContent)) {
      //     throw new Error(`Expected content "${expectedFileContent}" not found in file: ${filePath}`);
      //   }

      //   console.log('File content validated successfully.');
      // });

      // await test.step('Download and validate the CSV report', async () => {
      //   downloadManagerPopup = new DownloadManager(page);
      //   await downloadManagerPopup.openDownloadManagerPopup();
      //   await downloadManagerPopup.clickDownloadButton();
        

      //   //     const [download] = await Promise.all([
      //   //       page.waitForEvent('download'),
      //   //       downloadManagerPopup.clickDownloadButton(),
      //   //     ]);

      //   // Wait for file to appear in the downloads directory
      //   const files = fs.readdirSync(downloadDir);
      //   console.log('Files in download directory:', files);

      //   const csvFile = files.find(file => file.endsWith('.csv'));
      //   if (!csvFile) {
      //     throw new Error('CSV file not found in downloads directory.');
      //   }

      //   const filePath = path.join(downloadDir, csvFile);
      //   console.log(`Validating file content for file: ${filePath}...`);

      //   const fileContent = fs.readFileSync(filePath, 'utf-8');
      //   if (!fileContent.includes(expectedFileContent)) {
      //     throw new Error(`Expected content "${expectedFileContent}" not found in file: ${filePath}`);
      //   }

      // });

      await test.step('Download and validate the CSV report', async () => {
        downloadManagerPopup = new DownloadManager(page);

      
          await downloadManagerPopup.openDownloadManagerPopup();

          const [download] = await Promise.all([
            page.waitForEvent('download'),
            downloadManagerPopup.clickDownloadButton(),
          ]);

          const filePath = "../downloads/"
          console.log(`File downloaded to: ${filePath}`);

          downloadHelper.validateFileContent(filePath!, expectedFileContent);
    
      });

      console.log('Test completed successfully.');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
