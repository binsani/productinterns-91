
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';  
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info', 
  DEBUG: 'debug'
};

class Logger {
  private isDevelopment = import.meta.env.DEV;

  error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error, context);
    }
    // In production, send to monitoring service
    this.sendToMonitoring('error', message, error, context);
  }

  warn(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context);
    }
    this.sendToMonitoring('warn', message, null, context);
  }

  info(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context);
    }
  }

  private sendToMonitoring(level: string, message: string, error?: Error | unknown, context?: Record<string, any>) {
    // TODO: Implement monitoring service integration (e.g., Sentry, LogRocket)
    if (level === 'error') {
      // For now, we'll just structure the error properly
      const errorData = {
        level,
        message,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      // Store in localStorage temporarily for debugging
      if (this.isDevelopment) {
        const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
        logs.push(errorData);
        localStorage.setItem('error_logs', JSON.stringify(logs.slice(-50))); // Keep last 50 errors
      }
    }
  }
}

export const logger = new Logger();
