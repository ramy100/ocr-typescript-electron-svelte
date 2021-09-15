<style>
.select-file {
  grid-area: f;
}
.head {
  grid-area: h;
  text-align: center;
  color: rgb(117, 29, 2);
}
.select-folder {
  grid-area: sf;
}
.convert {
  grid-area: c;
}
.folder {
  grid-area: fo;
  color: lightslategrey;
}
.file {
  grid-area: fl;
  overflow: hidden;
  color: lightslategrey;
}
.back {
  grid-area: b;
}
main {
  display: grid;
  grid-auto-rows: minmax(50px, auto);
  grid-auto-columns: minmax(50px, 50px);
  justify-content: center;
  grid-template-areas:
    "h h h h h h"
    "f f f sf sf sf"
    "c c c c c c"
    "fl fl fl fl fl fl"
    "fo fo fo fo fo fo"
    ". load load load load ."
    ". load load load load ."
    ". load load load load ."
    ". load load load load ."
    "b b b b b b"
    ;
  gap: 20px;
  padding: 50px;
}
.loader::after{
  content:" ";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  border-top: 2px solid lightseagreen;
  border-right: 2px solid lightseagreen;
  border-radius: 50%;
  animation: rotate 1s linear infinite;

}

.loader{
  grid-area: load;
  position: relative;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes rotate{
  0%{transform: rotate(0deg);}
  100%{transform: rotate(360deg);}
}

</style>

<script>
let pdfFile;
let outputDir;
let page = 0
let converting = false
window.api.receive("ONE_IMAGE_CONVERTED",()=>{
  page++
})
window.api.receive("IMAGE_CONVERT_DONE",()=>{
  reset()
})

const reset = ()=>{
  pdfFile = undefined
  outputDir = undefined
  converting=false
  page = 0
}

const changeDir = async (e) => {
  try {
    const res = await window.api.chooseDirectory()
    if(res) outputDir = res
  } catch (error) {
    outputDir = undefined
  }
};

const changeFile = async() => {
  try {
    const res = await window.api.choosePdfFile()
    if(res) pdfFile = res
  } catch (error) {
    pdfFile = undefined;
  }
};

const convert = async () => {
    try {
      converting = true
      const res = await window.api.send("RUN_PDF_TO_IMAGES",{pdfFile,outputDir})
    } catch (error) {
      console.log(error)
    }
};
</script>

<main>
  <h1 class="head">Convert PDF to Images</h1>
  <button class="select-folder" on:click|preventDefault="{changeDir}"
    >Select folder</button>
  <button
    class="select-file"
    on:click|preventDefault={changeFile}
    >
    Select PDF file
  </button>
  {#if pdfFile}
    <div class="file">
      <h4>File : {pdfFile}</h4>
    </div>
  {/if}
  {#if outputDir}
    <div class="folder">
      <h4>Folder : {outputDir}</h4>
    </div>
  {/if}
  <button class="convert" on:click|preventDefault="{convert}">Convert</button>
  {#if converting}
    <div class="loader">
      <span class="page">
        page {page}
      </span>
    </div>
    
  {/if}
  <div class="back">
    <a href="#/"><h3>Back</h3></a>
  </div>
</main>
