<style >
main {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  padding: 50px;
}
h1 {
  grid-row: 1/1;
  grid-column: 1/7;
  text-align: center;
  color: rgb(117, 29, 2);
}

.chooseFiles {
  grid-column: 2/4;
  grid-row: 3/3;
}
.chooseOutFile {
  grid-column: 4/6;
  grid-row: 3/3;
}

.ocr {
  grid-column: 2/6;
  grid-row: 4/4;
}
.details {
  grid-column: 1/7;
  grid-row: 5/5;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
}
  .details > .files {
    display: grid;
    grid-template-columns: 1fr;
    text-align: center;
    gap: 5px;
    color: lightslategrey;
  }
.pages-converted {
  grid-row: 6/6;
  text-align: center;
  grid-column: 1/7;
}
.progress {
  display: grid;
  grid-column: 1/7;
  grid-row: 7/7;
  text-align: center;
  gap: 5px;
  position: relative;
}
.status {
  color: rgb(117, 29, 2);
  position: absolute;
  left: 50%;
  transform: translate(-50%, 100%);
}
.back {
  grid-row: 8/8;
  grid-column: 2/7;
}
</style>

<script>
import ProgressBar from "../../Components/ProgressBar/ProgressBar.svelte";
const electron = require("electron").remote;
const { app } = require("@electron/remote");
const path = require("path");
const fs = require("fs");
const { createWorker } = require("tesseract.js");

let images;
let distenation;
let progress;
let page = 1;
let converting = false;
let status;

const logger = (m) => {
  status = m.status;
  progress = m.progress;
};

const chooseFiles = async () => {
  try {
    const res = await electron.dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "images", extensions: ["jpeg", "jpg", "png", "bmp"] }],
    });
    if (res.filePaths.length) images = res;
  } catch (error) {
    images = undefined;
    console.log(error);
  }
};
const chooseDistenation = async () => {
  try {
    const res = await electron.dialog.showOpenDialog({
      properties: ["openFile", "promptToCreate"],
      filters: [
        {
          name: "output file",
          extensions: ["txt"],
        },
      ],
    });
    distenation = res.filePaths[0];
  } catch (error) {
    distenation = undefined;
    console.log(error);
  }
};

const runOcr = async () => {
  if (distenation && images) {
    try {
      const worker = createWorker({
        logger,
        // cachePath: path.join(app.getAppPath(), "..", ".lang-data"),
      });
      await worker.load();
      // await worker.loadLanguage("ara+eng");
      await worker.loadLanguage("ara");
      await worker.initialize("ara");
      converting = true;
      page = 0;
      for (let index = 0; index < images.filePaths.length; index++) {
        page = index;
        const {
          data: { text },
        } = await worker.recognize(images.filePaths[index]);
        fs.appendFile(distenation, text, (err) => {
          if (err) console.log(err);
        });
      }
      converting = false;
      distenation = undefined;
      images = undefined;
      page = 0;
      worker.terminate();
      electron.dialog.showMessageBox({
        title: "success",
        message: "Text converted Successfully please check the output file!",
        type: "info",
      });
    } catch (error) {
      worker.terminate();
      converting = false;
      distenation = undefined;
      images = undefined;
      page = 0;
      console.log(error);
    }
  } else {
    electron.dialog.showMessageBox({
      title: "missing inputs",
      message: "Make sure to select images and the output file first",
      type: "warning",
    });
  }
};
</script>

<main>
  <h1>Convert image to text</h1>

  <button class="chooseFiles" on:click="{chooseFiles}">choose files</button>
  <button class="chooseOutFile" on:click="{chooseDistenation}"
    >choose out file</button>
  <button class="ocr" on:click="{runOcr}">OCR</button>
  <div class="details">
    {#if images}
      <div class="files">
        <h2>Files</h2>
        {#each images.filePaths as file}
          <h5>{file}</h5>
        {/each}
      </div>
    {/if}
    {#if distenation}
      <div class="files">
        <h2>Output File</h2>
        <h5>{distenation}</h5>
      </div>
    {/if}
  </div>
  {#if converting}
    <h2 class="pages-converted">
      {`converted ${page} pages out of ${images.filePaths.length}`}
    </h2>
    <div class="progress">
      <ProgressBar value="{progress * 100}">
        <h3 class="status">{status}</h3>
      </ProgressBar>
    </div>
  {/if}
  <div class="back">
    <a href="#/"><h3>Back</h3></a>
  </div>
</main>
