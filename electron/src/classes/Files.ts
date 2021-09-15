const { dialog } = require('electron').remote;

export const files = {
  chooseImages: async () => {
    let images;
    try {
      const res = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'images', extensions: ['jpeg', 'jpg', 'png', 'bmp'] },
        ],
      });
      if (res.filePaths.length) {
        images = res.filePaths.map((v, i) => ({ path: v, pageNum: i }));
      }
      return images;
    } catch (error) {
      images = undefined;
      console.log(error);
    }
  },
  chooseTextFile: async () => {
    let distenation;
    try {
      const res = await dialog.showOpenDialog({
        properties: ['openFile', 'promptToCreate'],
        filters: [
          {
            name: 'output file',
            extensions: ['txt'],
          },
        ],
      });
      distenation = res.filePaths[0];
    } catch (error) {
      distenation = undefined;
      console.log(error);
    }
    return distenation;
  },
  chooseDirectory: async () => {
    const res = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    return res.filePaths[0];
  },
  choosePdfFile: async () => {
    let pdfFile;
    try {
      const res = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'file to convert', extensions: ['pdf'] }],
      });
      if (res.filePaths.length) pdfFile = res.filePaths[0];
    } catch (error) {
      pdfFile = undefined;
      console.log(error);
    }
    return pdfFile;
  },
};
