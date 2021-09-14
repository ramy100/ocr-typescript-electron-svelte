export type logger = { status: string; progress: string };

export interface ILogger {
  createOne(): logger;
  clearAll(): void;
  updateLogger(index: number, value: logger): logger;
}
