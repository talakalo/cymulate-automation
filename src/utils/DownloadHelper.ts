import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';


export class DownloadHelper {
  private downloadDir: string;


  constructor(downloadDir: string) {
    this.downloadDir = downloadDir;
  
  }

  clearDownloadDir() {
    try {
      Logger.info('Clearing download directory...');
      if (fs.existsSync(this.downloadDir)) {
        fs.rmSync(this.downloadDir, { recursive: true, force: true });
      }
      fs.mkdirSync(this.downloadDir);
      Logger.info('Download directory cleared successfully.');
    } catch (error) {
      Logger.error('Error clearing download directory:', error);
      throw error;
    }
  }

  async validateFileContent(directory: string, fileName: string, expectedContent: string): Promise<void> {
    let retries = 10; // Number of retries to check the file
    const retryInterval = 1000; // Interval between retries (in ms)
  
    while (retries > 0) {
      const files = fs.readdirSync(directory);
      const matchingFile = files.find(file => file.startsWith(fileName) && !file.endsWith('.crdownload'));
  
      if (matchingFile) {
        const filePath = path.join(directory, matchingFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        if (!content.includes(expectedContent)) {
          throw new Error(`Expected content not found in file: ${filePath}`);
        }
        Logger.info('File content validated successfully.');
        return;
      }
  
      Logger.info(`Waiting for file download to complete. Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      retries--;
    }
  
    throw new Error('File not found or download not completed after retries.');
  }
  
  
  /*  async validateFileContent(expectedContent: string) {
      try {
    Logger.info(`Validating files in directory: ${this.downloadDir}`);
  
    // List all files in the directory
    const files = fs.readdirSync(this.downloadDir);
    Logger.info('Files in directory:', files);
  
    // Find the first CSV file
    const csvFile = files.find(file => file.startsWith('web_application_firewall'));
    if (!csvFile) {
      throw new Error('No CSV file found in downloads directory.');
    }
  
    // Construct the full path to the file
    const filePath = path.join(this.downloadDir, csvFile);
    Logger.info(`Reading file: ${filePath}`);
  
    // Read file content
    const content = fs.readFileSync(filePath, 'utf-8');
    Logger.info('File content read successfully.');
  
    // Check if the file content includes the expected content
    if (!content.includes(expectedContent)) {
      throw new Error(`Expected content not found in file: ${filePath}`);
    }
  
    Logger.info('File content validated successfully.');
  } catch (error) {
    console.error('Error validating file content:', error);
    // Read the content of the file
    throw error;
  }
   // }
   
  // Validate if the content includes the expected content
  */
}
