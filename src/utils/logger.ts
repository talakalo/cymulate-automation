export class Logger {
    
    static error(message: string, error: any) {
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    }
  
    static warn(message: string) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
    }

    static info(message: string) {
      console.info(`[INFO] ${new Date().toISOString()}: ${message}`);
    }

    static debug(message: string) {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
  }
  
