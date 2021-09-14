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
  chooseDist: async () => {
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
};
