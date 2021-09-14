import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { ImageManager } from './classes/ImagesManager';
import { Loggers } from './classes/Loggers';
import { Ocr } from './classes/Ocr';
import { OutputManager } from './classes/OutputManager';
import { WorkersManager } from './classes/Workers';
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
  // win.loadFile(path.join(__dirname, '../../public/index.html'));
  win.loadURL('http://localhost:5000');
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on('runOcr', async (e, { images, distenation, limit }) => {
  if (!images || !distenation) {
    ipcMain.emit('error:main');
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
});

ipcMain.on('ocrDone:main', () => {
  dialog.showMessageBox({
    title: 'success',
    message: 'Text converted Successfully please check the output file!',
    type: 'info',
  });
});

ipcMain.on('error:main', () => {
  BrowserWindow.getFocusedWindow()?.webContents.send('ocrDone:renderer');
  dialog.showMessageBox({
    title: 'success',
    message: 'make sure to specify images and output file first',
    type: 'warning',
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
