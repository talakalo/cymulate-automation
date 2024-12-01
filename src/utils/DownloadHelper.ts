import * as fs from 'fs';
import * as path from 'path';

export class DownloadHelper {
  private downloadDir: string;

  constructor(downloadDir: string) {
    this.downloadDir = downloadDir;
  }

  clearDownloadDir() {
    try {
      console.log('Clearing download directory...');
      if (fs.existsSync(this.downloadDir)) {
        fs.rmSync(this.downloadDir, { recursive: true, force: true });
      }
      fs.mkdirSync(this.downloadDir);
      console.log('Download directory cleared successfully.');
    } catch (error) {
      console.error('Error clearing download directory:', error);
      throw error;
    }
  }

  validateFileContent(filePath: string, expectedContent: string) {
    try {
      console.log(`Validating file content for file: ${filePath}...`);
      const content = fs.readFileSync(filePath, 'utf-8');
      if (!content.includes(expectedContent)) {
        throw console.error(`Expected content not found in file: ${filePath}`);
      }
      console.log('File content validation successful.');
    } catch (error) {
      console.error('Error validating file content:', error);
      throw error;
    }
  }
}
