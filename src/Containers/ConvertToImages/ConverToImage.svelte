<style>
.drop-here {
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  grid-area: d;
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
    "d d d d d d"
    "d d d d d d"
    "d d d d d d"
    "d d d d d d"
    "sf sf sf c c c"
    "fl fl fl fl fl fl"
    "fo fo fo fo fo fo"
    "b b b b b b";
  gap: 20px;
  padding: 50px;
}
</style>

<script lang="ts">
const electron = require("electron").remote;
const pdf = require("pdf-poppler");
import { onMount } from "svelte";
let pdfFile;
let distenation;
let el;
$: opts = {
  format: "jpeg",
  out_dir: distenation,
  out_prefix: "page",
};

onMount(() => {
  el = document.querySelector(".drop-here") as HTMLDivElement;
});

const changeDir = async (e) => {
  const res = await electron.dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  distenation = res.filePaths[0];
};

const dropped = (e) => {
  try {
    const item = e.dataTransfer.items[0];
    if (item && item.kind == "file") {
      pdfFile = item.getAsFile();
    }
    el.style.backgroundColor = "white";
  } catch (error) {
    console.log("error");
  }
};

const dragOver = (e) => {
  el.style.backgroundColor = "grey";
};

const dragLeave = (e) => {
  el.style.backgroundColor = "white";
};

const convert = () => {
  if (!pdfFile || !distenation)
    electron.dialog.showMessageBox({
      title: "missing inputs",
      message: "Make sure to select the pdf file and the output folder first",
      type: "warning",
    });
  else {
    pdf
      .convert(pdfFile.path, opts)
      .then((res) => {
        console.log("Successfully converted");
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
</script>

<main>
  <h1 class="head">Convert PDF to Images</h1>
  <button class="select-folder" on:click|preventDefault="{changeDir}"
    >Select folder</button>
  <div
    class="drop-here"
    on:drop|preventDefault="{dropped}"
    on:dragover|preventDefault="{dragOver}"
    on:dragleave|preventDefault="{dragLeave}">
    drop here
  </div>
  {#if pdfFile}
    <div class="file">
      <h4>File : {pdfFile.name}</h4>
    </div>
  {/if}
  {#if distenation}
    <div class="folder">
      <h4>Folder : {distenation}</h4>
    </div>
  {/if}
  <button class="convert" on:click|preventDefault="{convert}">Convert</button>
  <div class="back">
    <a href="#/"><h3>Back</h3></a>
  </div>
</main>
