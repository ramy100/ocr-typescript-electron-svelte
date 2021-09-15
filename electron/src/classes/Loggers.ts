import { BrowserWindow } from 'electron';
import { rendererRecieveEvents } from '../Events';
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
    BrowserWindow.getAllWindows().forEach((w) => {
      w.webContents.send(rendererRecieveEvents.UPDATE_LOGGERS, this.loggers);
    });
    return this.loggers[index];
  }
}
