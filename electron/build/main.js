"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
require('@electron/remote/main').initialize();
var path_1 = __importDefault(require("path"));
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
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
    win.loadFile(path_1.default.join(__dirname, '../../public/index.html'));
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
