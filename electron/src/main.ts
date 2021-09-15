import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { ImageManager } from './classes/ImagesManager';
import { Loggers } from './classes/Loggers';
import { Ocr } from './classes/Ocr';
import { OutputManager } from './classes/OutputManager';
import { WorkersManager } from './classes/Workers';
import {
  mainEvents,
  rendererRecieveEvents,
  rendererSendEvents,
} from './Events';
import chokidar from 'chokidar';
// @ts-ignore
import pdf from 'pdf-poppler';
require('@electron/remote/main').initialize();
// require('electron-reloader')(module);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    resizable: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: '../../public/favicon.png',
  });
  win.loadFile(path.join(__dirname, '../../public/index.html'));
  // win.loadURL('http://localhost:5000');
  // win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on(
  rendererSendEvents.RUN_OCR,
  async (e, { images, distenation, limit }) => {
    if (!images || !distenation || !limit) {
      BrowserWindow.getAllWindows().forEach((w) => {
        w.webContents.send(rendererRecieveEvents.OCR_DONE);
      });
      dialog.showMessageBox({
        title: 'failed',
        message: 'make sure to specify images and output file first',
        type: 'warning',
      });
      return;
    }

    const imageManager = new ImageManager(images);
    const loggerManager = new Loggers();
    const workersManager = new WorkersManager(limit, loggerManager);
    const outputmanager = new OutputManager(
      distenation,
      images.length,
      workersManager
    );
    const ocr = new Ocr(workersManager, imageManager, outputmanager);
    await workersManager.init();
    await ocr.run();
  }
);

ipcMain.on(
  rendererSendEvents.RUN_PDF_TO_IMAGES,
  async (_, { pdfFile, outputDir }) => {
    if (!pdfFile || !outputDir) {
      BrowserWindow.getAllWindows().forEach((w) => {
        w.webContents.send(rendererRecieveEvents.IMAGE_CONVERT_DONE);
      });
      dialog.showMessageBox({
        title: 'failed',
        message: 'make sure to specify pdfFile and output folder first',
        type: 'warning',
      });
      return;
    }
    const opts = {
      format: 'jpeg',
      out_dir: outputDir,
      out_prefix: 'page',
    };
    const watcher = chokidar.watch(outputDir, { ignoreInitial: true });
    watcher.on('add', (path, stats) => {
      BrowserWindow.getAllWindows().forEach((w) => {
        w.webContents.send(rendererRecieveEvents.ONE_IMAGE_CONVERTED);
      });
    });
    try {
      await pdf.convert(pdfFile, opts);
      watcher.close();
      BrowserWindow.getAllWindows().forEach((w) => {
        w.webContents.send(rendererRecieveEvents.IMAGE_CONVERT_DONE);
      });
      dialog.showMessageBox({
        title: 'success',
        message: 'successfully converted pdf to image',
        type: 'info',
      });
    } catch (error) {
      watcher.close();
      dialog.showMessageBox({
        title: 'failed',
        message: 'Error',
        type: 'error',
      });
    }
  }
);

ipcMain.on(mainEvents.OCR_DONE, () => {
  dialog.showMessageBox({
    title: 'success',
    message: 'Text converted Successfully please check the output file!',
    type: 'info',
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
