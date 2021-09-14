import { createWorker } from 'tesseract.js';
import { ILogger } from '../interfaces/ILogger';

export class WorkersManager {
  workers: Tesseract.Worker[] = [];

  constructor(private limit: number, private logger: ILogger) {}

  async init() {
    for (let num = 0; num < this.limit; num++) {
      this.logger.createOne();
      const worker = createWorker({
        logger: (arg) => {
          this.logger.updateLogger(num, arg);
        },
      });
      await worker.load();
      await worker.loadLanguage('ara');
      await worker.initialize('ara');
      this.workers.push(worker);
    }
  }

  terminateAll() {
    this.workers.forEach((worker) => {
      worker.terminate();
    });
  }
}
