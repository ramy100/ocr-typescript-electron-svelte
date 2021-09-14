export interface IWorkersManager {
  workers: Tesseract.Worker[];

  init(): Promise<void>;

  terminateAll(): void;
}
