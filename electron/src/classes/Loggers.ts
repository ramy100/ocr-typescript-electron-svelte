import { BrowserWindow } from 'electron';
import { ILogger, logger } from '../interfaces/ILogger';

export class Loggers implements ILogger {
  private loggers: logger[] = [];

  constructor() {}

  createOne() {
    const length = this.loggers.push({ status: '', progress: '' });
    return this.loggers[length];
  }

  clearAll() {
    this.loggers = [];
  }

  updateLogger(index: number, value: logger) {
    this.loggers[index] = value;
    BrowserWindow.getFocusedWindow()?.webContents.send(
      'updateLoggers',
      this.loggers
    );
    return this.loggers[index];
  }
}
