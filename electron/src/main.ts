import { app, BrowserWindow } from 'electron';
require('@electron/remote/main').initialize();
import path from 'path';
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    resizable: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: '../../public/favicon.png',
  });
  win.loadFile(path.join(__dirname, '../../public/index.html'));
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
