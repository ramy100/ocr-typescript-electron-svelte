import { contextBridge, ipcRenderer } from 'electron';
import os from 'os';
import { files } from './classes/Files';
import { rendererRecieveEvents, rendererSendEvents } from './Events';

contextBridge.exposeInMainWorld('api', {
  send: (channel: rendererSendEvents, data: any) => {
    let validChannels = Object.values(rendererSendEvents);
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: rendererRecieveEvents, func: any) => {
    let validChannels = Object.values(rendererRecieveEvents);
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  numberOfCores: () => os.cpus().length,
  chooseImages: files.chooseImages,
  chooseTextFile: files.chooseTextFile,
  chooseDirectory: files.chooseDirectory,
  choosePdfFile: files.choosePdfFile,
});
