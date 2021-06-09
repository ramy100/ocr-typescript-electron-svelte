"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
require('electron-reloader')(module);
require('@electron/remote/main').initialize();
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 900,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            // preload: path.join(__dirname, 'preload.js'),
        },
        icon: '../../public/favicon.png',
    });
    win.loadURL('http://localhost:5000');
    win.webContents.openDevTools();
};
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
