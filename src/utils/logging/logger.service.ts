import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';

@Injectable()
export class LoggerService {
  private logDirectory: string;

  constructor() {
    this.logDirectory = path.join(process.cwd(), 'logs');
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    if (!fs.existsSync(directory)) {
      try {
        await fs.promises.mkdir(directory, { recursive: true });
        console.log(`Directory created: ${directory}`);
      } catch (error) {
        console.error(`Error creating directory ${directory}:`, error);
        throw error;
      }
    }
  }

  private async appendLogEntry(
    filePath: string,
    logEntry: string,
  ): Promise<void> {
    try {
      await fs.promises.appendFile(filePath, logEntry);
      console.log('Log entry added successfully.');
    } catch (error) {
      console.error(`Error writing to log file ${filePath}:`, error);
      throw error;
    }
  }

  public async logDeletion(newsTitle: string, userId: string): Promise<void> {
    const logFilePath = path.join(this.logDirectory, 'news_deletions.log');
    const logEntry = `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] News deleted: ${newsTitle} by user ${userId}\n`;

    await this.ensureDirectoryExists(this.logDirectory);
    await this.appendLogEntry(logFilePath, logEntry);
  }

  public async logSubscription(name: string, email: string): Promise<void> {
    const subscriptionDirectory = path.join(this.logDirectory, 'subscriptions');
    const logFilePath = path.join(
      subscriptionDirectory,
      'subscription_logs.log',
    );
    const logEntry = `Дата: ${new Date().toLocaleString()}, Имя: ${name}, Email: ${email}\n`;

    await this.ensureDirectoryExists(subscriptionDirectory);
    await this.appendLogEntry(logFilePath, logEntry);
  }
}
