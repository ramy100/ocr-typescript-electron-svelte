const { ipcMain } = require('electron');
import { BrowserWindow } from 'electron';
import fs from 'fs';
import { WorkersManager } from './Workers';
export class OutputManager {
  private extractedText: { [property: number]: string } = {};
  private lastAppendedPage = 0;

  constructor(
    private destination: string,
    private lastPage: number,
    private workersManager: WorkersManager
  ) {}

  recievedText(output: { text: string; pageNum: number }) {
    this.extractedText[output.pageNum] = output.text;
    this.recursiveWrite();
  }

  recursiveWrite() {
    const text = this.extractedText[this.lastAppendedPage];
    if (text) {
      this.outPutToFile(text);
      delete this.extractedText[this.lastAppendedPage];
      this.lastAppendedPage++;
      this.recursiveWrite();
    }
  }

  outPutToFile(text: string) {
    fs.appendFile(
      this.destination,
      `${text}\nPage ${this.lastAppendedPage + 1}\n`,
      (err) => {
        if (err) console.log(err);
        if (this.lastPage == this.lastAppendedPage) {
          ipcMain.emit('ocrDone:main');
          BrowserWindow.getFocusedWindow()?.webContents.send(
            'ocrDone:renderer'
          );
          this.workersManager.terminateAll();
        }
      }
    );
  }
}
