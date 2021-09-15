const { ipcMain } = require('electron');
import { BrowserWindow } from 'electron';
import fs from 'fs/promises';
import { mainEvents, rendererRecieveEvents } from '../Events';
import { WorkersManager } from './Workers';
export class OutputManager {
  private extractedText: { [property: number]: string } = {};
  private nextPageToAppend = 0;

  constructor(
    private destination: string,
    private lastPage: number,
    private workersManager: WorkersManager
  ) {}

  recievedText(output: { text: string; pageNum: number }) {
    this.extractedText[output.pageNum] = output.text;
    this.recursiveWrite();
  }

  async recursiveWrite() {
    if (this.lastPage == this.nextPageToAppend) {
      BrowserWindow.getAllWindows().forEach((w) => {
        w.webContents.send(rendererRecieveEvents.OCR_DONE);
      });
      ipcMain.emit(mainEvents.OCR_DONE);
      this.workersManager.terminateAll();
      return;
    }
    const text = this.extractedText[this.nextPageToAppend];
    if (text) {
      await this.outPutToFile(text);
      delete this.extractedText[this.nextPageToAppend];
      this.nextPageToAppend++;
      await this.recursiveWrite();
      return;
    }
  }

  async outPutToFile(text: string) {
    try {
      await fs.appendFile(
        this.destination,
        `${text}\nPage ${this.nextPageToAppend + 1}\n`
      );

      return;
    } catch (error) {
      console.log(error);
      this.workersManager.terminateAll();
      return;
    }
  }
}
