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

.recommended {
  grid-column: 2/6;
  grid-row: 2/2;
}

.limit-text{
  margin-left: 15px;
  color: red;
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
const {EventEmitter} = require("events");
const fs = require("fs");
const os = require("os");
const { createWorker } = require("tesseract.js");

let images;
let distenation;
let limit = Math.floor(os.cpus().length  / 2);
let page = 1;
let converting = false;
let loggers = []
let pagesToConvert = 0
let extractedText = {}
let lastAppended = -1
let workers = []
const workersEvents = new EventEmitter();

const chooseFiles = async () => {
  try {
    const res = await electron.dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "images", extensions: ["jpeg", "jpg", "png", "bmp"] }],
    });
    if (res.filePaths.length) {
      images = res.filePaths.map((v,i)=>
        ({path:v,pageNum:i})
      )
      pagesToConvert = images.length
    };
  } catch (error) {
    images = undefined;
    pagesToConvert = 0
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

const createWorkers = async (limit)=>{
  for (let num = 0; num < limit; num++) {
    loggers[num] = {status:"",progress:""}
    const worker = createWorker({
    logger:(arg)=>{
      loggers[num].progress = arg.progress
      loggers[num].status = arg.status
    },
    // cachePath: path.join(app.getAppPath(), "..", ".lang-data"),
    });
    await worker.load();
    await worker.loadLanguage("ara");
    await worker.initialize("ara");
    workers.push(worker)
  }
  workers = workers
}

const terminateWorkers =  ()=>{
  workers.forEach((worker) => {
    worker.terminate()
  });
  loggers = []
}

const OnComplete = (err,dontClear) => {
  if(!dontClear){
    distenation = undefined;
    images = undefined;
  }
  converting = false;
  page = 1;
  pagesToConvert = 0;
  extractedText = {}
  lastAppended = -1
  workers = []
  if(!err) electron.dialog.showMessageBox({
    title: "success",
    message: "Text converted Successfully please check the output file!",
    type: "info",
  });
  if(err) electron.dialog.showMessageBox({
      title: "missing inputs",
      message: err,
      type: "warning",
  });

}

const appendText = (text)=>{
  return new Promise((resolve,reject)=>{
    fs.appendFile(distenation, text, (err) => {
      if (err) reject(err);
      page++
      if(pagesToConvert == page){
        workersEvents.emit("done")
      }
      resolve(true)
    });
  })
}

const extractText = async (worker)=>{
  const image = images.shift()
  images=images
  if(!image) return null
  const {data:{text}} = await worker.recognize(image.path)
  return {text, pageNum : image.pageNum}
}

const readAnImage = async (worker)=>{
  const payload = await extractText(worker)
  if(payload) {
    const {text,pageNum} = payload
    workersEvents.emit("text",{text,pageNum})
    readAnImage(worker)
  }
}


workersEvents.on("text",async (payload)=>{
  if( payload.text ) extractedText[payload.pageNum] = payload.text
  if(payload.appendThis) await appendText(payload.appendThis)
  if(extractedText[lastAppended + 1]){
    const first = extractedText[lastAppended + 1]
    delete extractedText[lastAppended + 1]
    console.log(`extractedText ====> `, extractedText)
    lastAppended++
    workersEvents.emit("text",{appendThis:first})
  }
})

workersEvents.on("done",()=>{
  OnComplete()
  terminateWorkers()
})


const runOcr =  async () => {
  if(!images){
    OnComplete("no images selected",true)
    return
  }
  if(!distenation){
    OnComplete("no output file selected",true)
    return
  }

  try {
    await createWorkers(limit)
    converting = true;
    page = 0;
    pagesToConvert = images.length
    workers.forEach(async worker=>{
      readAnImage(worker)
    })
  } catch (error) {
    OnComplete(error.message)
    terminateWorkers(workers)
  }
};
</script>

<main>
  <h1>Convert image to text</h1>
  <h2 for="speed">Speed: </h2>
  <div class="recommended">
    <select on:change={(e)=>{limit = e.target.value}}>
      {#each Array(os.cpus().length) as _, i}
      <option selected={i+1 === limit} value={i+1}>{i + 1}</option>
      {/each}
    </select>
    <span class="limit-text">{"recommended for your cpu is " + Math.floor(os.cpus().length  / 2)}</span>
  </div>

  <button class="chooseFiles" on:click="{chooseFiles}">choose files</button>
  <button class="chooseOutFile" on:click="{chooseDistenation}"
    >choose out file</button>
  <button class="ocr" on:click="{runOcr}">OCR</button>
  <div class="details">
    {#if images}
      <div class="files">
        <h2>Files</h2>
        {#each images as file}
          <h5>{file.path}</h5>
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
      {`converted ${page} pages out of ${pagesToConvert}`}
    </h2>
    <div class="progress">
      {#each loggers as logger}
        <ProgressBar value="{logger.progress * 100}">
          <h3 class="status">{logger.status}</h3>
        </ProgressBar>
        {/each}
    </div>
  {/if}
  <div class="back">
    <a href="#/"><h3>Back</h3></a>
  </div>
</main>
