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

let images;
let distenation;
let cores = window.api.numberOfCores()
let recomended = Math.floor(cores  / 2)
let limit = recomended;
let page = 0;
let converting = false;
let loggers = []
let pagesToConvert = 0
window.api.receive("OCRDONE:RENDERER",()=>{
    reset()
})
window.api.receive("ONEPAGECONVERTED",()=>{
    page++
})
window.api.receive("UPDATELOGGERS",(newLoggers)=>{
    loggers = newLoggers
})
const reset = () => {
  distenation = images = undefined;
  page = pagesToConvert = 0;
  converting = false
  loggers = []
}

const chooseFiles =  async () => {
  let selectedImages = await window.api.chooseImages()
  if(selectedImages) {
    images = selectedImages
    pagesToConvert = selectedImages.length
  }
};

const chooseDistenation = async () => {
  let selectedDistenation = await window.api.chooseTextFile()
  if(selectedDistenation) distenation = selectedDistenation
};

const runOcr =  async () => {
  converting = true
  if(images) {if(images.length < limit) limit = images.length}
  window.api.send("RUNOCR",{images,distenation,limit})
};

</script>

<main>
  <h1>Convert image to text{converting}</h1>
  <h2 for="speed">Speed: </h2>
  <div class="recommended">
    <select on:change={(e)=>{limit = e.target.value}}>
      {#each Array(cores) as _, i}
      <option selected={i+1 === limit || i+1 === recomended} value={i+1}>{i+1 === recomended ? `${i + 1} Recomended` : i + 1}</option>
      {/each} 
    </select> 
    <span class="limit-text">{`${limit} images to be converted in parallel`}</span>
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
