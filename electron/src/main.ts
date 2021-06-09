import { app, BrowserWindow } from 'electron';
require('electron-reloader')(module);
require('@electron/remote/main').initialize();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 900,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: '../../public/favicon.png',
  });
  win.loadURL('http://localhost:5000');
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
