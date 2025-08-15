// Logging Middleware - Reusable package for API logging
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogStack = 'backend' | 'frontend';
export type LogPackage = 
  // Frontend only packages
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  // Backend only packages (not used in this frontend app)
  | 'cache' | 'controller' | 'cron job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service'
  // Shared packages
  | 'auth' | 'config' | 'middleware' | 'utils';

interface LogRequest {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

interface LogResponse {
  logID: string;
  message: string;
}

class Logger {
  private static readonly LOG_API_URL = import.meta.env.VITE_LOG_API_URL || 'http://20.244.56.144/evaluation-service/logs';
  
  /**
   * Main logging function that sends logs to the test server
   * @param stack - The application stack (frontend/backend)
   * @param level - The log level (debug/info/warn/error/fatal)
   * @param packageName - The package where the log originated
   * @param message - The log message
   */
  static async log(
    stack: LogStack,
    level: LogLevel,
    packageName: LogPackage,
    message: string
  ): Promise<LogResponse | null> {
    try {
      const logRequest: LogRequest = {
        stack,
        level,
        package: packageName,
        message
      };

      const response = await fetch(this.LOG_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logRequest)
      });

      if (!response.ok) {
        console.error(`Failed to send log: ${response.status} ${response.statusText}`);
        return null;
      }

      const result: LogResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending log to server:', error);
      return null;
    }
  }

  // Convenience methods for different log levels
  static async debug(packageName: LogPackage, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'debug', packageName, message);
  }

  static async info(packageName: LogPackage, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'info', packageName, message);
  }

  static async warn(packageName: LogPackage, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'warn', packageName, message);
  }

  static async error(packageName: LogPackage, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'error', packageName, message);
  }

  static async fatal(packageName: LogPackage, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'fatal', packageName, message);
  }
}

export default Logger;
