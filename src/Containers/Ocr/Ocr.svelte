<script>
import { Link } from "svelte-navigator";
import ProgressBar from "../../Components/ProgressBar/ProgressBar.svelte";
const electron = require("electron").remote
const {app} = require('@electron/remote')
const path = require('path')
const fs = require("fs")
const {createWorker} = require("tesseract.js")

let images
let distenation
let progress = 0
let page = 1
let converting = false
let status

const logger = (m)=>{
    status = m.status
    progress=m.progress
}
const worker = createWorker({logger,cachePath:path.join(app.getAppPath(),"..",".lang-data")})

const chooseFiles = async ()=>{
    images =  await electron.dialog.showOpenDialog({properties:["openFile","multiSelections"]})
}
const chooseDistenation = async ()=>{
    const res = await electron.dialog.showOpenDialog({properties:["openFile"]})
    distenation = res.filePaths[0]
}

const runOcr =async ()=>{
    try {
        await worker.load()
        await worker.loadLanguage("ara+eng")
        await worker.initialize("ara")
        converting = true;
        page=0
        for (let index = 0; index < images.filePaths.length; index++) {
            page = index
            const { data: { text } } = await worker.recognize(images.filePaths[index]);
            fs.appendFile(distenation,text,(err)=>{
                if(err) console.log(err)
            })
        }
        converting=false
    } catch (error) {
        converting=false
        console.log(error)
    }
}


</script>
<main>
    <button on:click={chooseFiles}>choose files</button>
    <button on:click={chooseDistenation}>choose out file</button>
    {#if images}
        <h4>Files :</h4>
         {#each images.filePaths as file}
            <h5>{file}</h5>
        {/each}
    {/if}
    {#if distenation}
        <h4>Directory :</h4>
        <h5>{distenation}</h5>
    {/if}
    <button on:click={runOcr}>OCR</button>
    {#if converting}
    <h5>converted {`${page}/${images.filePaths.length}`}</h5>
    <ProgressBar value={progress*100}>{status}</ProgressBar>
    {/if}
    <Link to="/">Home</Link>
</main>