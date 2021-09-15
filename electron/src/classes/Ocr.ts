import { BrowserWindow } from 'electron';
import { rendererRecieveEvents } from '../Events';
import { IWorkersManager } from '../interfaces/IWorkersManager';
import { ImageManager } from './ImagesManager';
import { OutputManager } from './OutputManager';

export class Ocr {
  constructor(
    private workersManager: IWorkersManager,
    private imageManager: ImageManager,
    private outputmanager: OutputManager
  ) {}

  private extractText = async (worker: Tesseract.Worker) => {
    const image = this.imageManager.shift();
    if (!image) return null;
    try {
      const {
        data: { text },
      } = await worker.recognize(image.path);
      return { text, pageNum: image.pageNum };
    } catch (error) {
      console.log(error);
    }
  };

  private readAnImage = async (worker: Tesseract.Worker) => {
    const payload = await this.extractText(worker);
    if (payload) {
      BrowserWindow.getAllWindows().forEach((w) => {
        w.webContents.send(rendererRecieveEvents.ONE_PAGE_CONVERTED);
      });
      const { text, pageNum } = payload;
      this.outputmanager.recievedText({ text, pageNum });
      await this.readAnImage(worker);
    }
  };

  run = async () => {
    try {
      this.workersManager.workers.forEach(async (worker) => {
        await this.readAnImage(worker);
      });
    } catch (error) {
      console.log(error);
      this.workersManager.terminateAll();
    }
    return true;
  };
}
