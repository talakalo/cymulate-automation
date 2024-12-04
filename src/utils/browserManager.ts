import { BrowserContext, Browser, chromium, Page } from 'playwright';
import * as path from 'path';

export enum BrowserType {
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  EDGE = 'edge',
}

export class BrowserManager {
  private browser!: Browser;
  private context!: BrowserContext;
  private page!: Page;
  private downloadDir: string;

  constructor() {
    this.downloadDir = path.resolve(__dirname, '../downloads');
  }

  // Initialize the browser, context, and page
  async initialize(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    

    // Create a new page and set the download behavior
    this.page = await this.context.newPage();
    this.page.setViewportSize({ width: 1920, height: 937 });
    await this.context.newCDPSession(this.page).then(client => {
      client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: this.downloadDir,
      });
    });
  }

  // Get the page instance
  getPage(): Page {
    return this.page;
  }

  // Clean up or close the browser
  async tearDown(): Promise<void> {
    await this.browser.close();
  }

  // Get the download path
  getDownloadDir(): string {
    return this.downloadDir;
  }
}