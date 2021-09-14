import { contextBridge, ipcRenderer } from 'electron';
import os from 'os';
import { files } from './classes/Files';

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => {
    let validChannels = ['runOcr'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: any) => {
    let validChannels = [
      'ocrDone:renderer',
      'updateLoggers',
      'onePageConverted',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  numberOfCores: () => os.cpus().length,
  chooseImages: files.chooseImages,
  chooseDist: files.chooseDist,
});
