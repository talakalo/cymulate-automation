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

  async validateFileContent(directory: string, fileName: string, expectedContent: string): void {
    
    let retries = 5;
    while (retries > 0) {
      const files = fs.readdirSync(directory);
      
      console.log(`Waiting for file: ${fileName}...`);
      console.log(`directory: ${directory}`);
      if (directory && files.some(file => file.includes(fileName))) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries--;
    }
    if (retries === 0) {
      throw new Error('File not found after retries.');
    }

    const content = fs.readFileSync(directory, 'utf-8');
    if (!content.includes(expectedContent)) {
      throw new Error(`Expected content not found in file: ${directory}`);
    }
    console.log('File content validated successfully.');
  }

  /*  async validateFileContent(expectedContent: string) {
      try {
    console.log(`Validating files in directory: ${this.downloadDir}`);
  
    // List all files in the directory
    const files = fs.readdirSync(this.downloadDir);
    console.log('Files in directory:', files);
  
    // Find the first CSV file
    const csvFile = files.find(file => file.startsWith('web_application_firewall'));
    if (!csvFile) {
      throw new Error('No CSV file found in downloads directory.');
    }
  
    // Construct the full path to the file
    const filePath = path.join(this.downloadDir, csvFile);
    console.log(`Reading file: ${filePath}`);
  
    // Read file content
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log('File content read successfully.');
  
    // Check if the file content includes the expected content
    if (!content.includes(expectedContent)) {
      throw new Error(`Expected content not found in file: ${filePath}`);
    }
  
    console.log('File content validated successfully.');
  } catch (error) {
    console.error('Error validating file content:', error);
    // Read the content of the file
    throw error;
  }
   // }
   
  // Validate if the content includes the expected content
  */
}
