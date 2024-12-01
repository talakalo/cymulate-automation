import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class DownloadManager {
    private page: Page;


    // Selectors
    readonly downloadManagerPopup = '[data-testid="download-manager-overlay-content"]';
    readonly downloadCard = '.DownloadCard_download-card__rioKm';
    readonly downloadButton = '[data-testid^="download-report-button"]';
    readonly reportText = '.DownloadCard_card-text__K79ZZ';

    constructor(page: Page) {
        this.page = page;
    }

   async clickDownloadButton() {
        console.log('Clicking the download button...');
        const downloadButton = this.page.locator(this.downloadButton).first()

        await downloadButton.click();

    }
    async openDownloadManagerPopup() {
        try {
            console.log('Opening Download Manager popup...');
            await this.page.getByTestId('open-download-manager-button').click();
            await this.page.waitForSelector(this.downloadManagerPopup, { state: 'visible', timeout: 30000 });
            console.log('Download Manager popup is visible.');
        } catch (error) {
            console.error('Failed to open Download Manager popup:', error);
            throw error;
        }
    }

    async validateAndDownloadReport(expectedText: string) {
        try {
            console.log('Validating report text in Download Manager popup...');
            const reportText = await this.page.textContent(this.reportText);

            if (reportText !== null && !reportText.includes(expectedText)) {
                throw new Error(`Expected text "${expectedText}" not found in the report.`);
            }
            console.log('Report text validated successfully.');

            console.log('Clicking the download button...');
            const downloadButton = this.page.locator(this.downloadButton).first()

            await downloadButton.click();

            const [download] = await Promise.all([
                this.page.waitForEvent('download'),
            ]);

            const downloadDir = path.join(__dirname, '..', 'downloads');
            const filePath = path.join(downloadDir, download.suggestedFilename());
        

            console.log(`File downloaded at: ${filePath}`);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            if (!fileContent.includes('https://ekslabs.cymulatedev.com\\Program Files\\Apache Group\\Apache\\logs\\error.log')) {
                throw new Error('Expected content not found in the downloaded file.');
            }

            console.log('File content validated successfully.');
        } catch (error) {
            console.error('Error during report validation or download:', error);
            throw error;
        }
    }
}
