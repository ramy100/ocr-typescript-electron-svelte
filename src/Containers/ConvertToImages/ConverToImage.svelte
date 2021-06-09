<script lang="ts">
	const electron = require("electron").remote
	const pdf = require('pdf-poppler');
	import {onMount} from 'svelte'
import { Link } from 'svelte-navigator';
	let pdfFile
	let distenation;
	let el
	$: opts = {
    format: 'jpeg',
    out_dir: distenation,
    out_prefix: 'page',
}

	onMount(()=>{
		el = document.querySelector(".drop-here") as HTMLDivElement
	})

	const changeDir = async (e)=>{
		const res = await electron.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
	distenation = res.filePaths[0]
	}

	const dropped = (e)=>{
		try {
			const item = e.dataTransfer.items[0]
			if(item && item.kind == "file"){
				pdfFile = item.getAsFile()
			}
			el.style.backgroundColor="white"

		} catch (error) {
			console.log("error")
		}
  	}

	const dragOver = (e)=>{
		el.style.backgroundColor="grey"
	}

	const dragLeave = (e)=>{
		el.style.backgroundColor="white"
	}

	const convert = () => {
	pdf
		.convert(pdfFile.path, opts)
		.then((res) => {
		console.log('Successfully converted');
		})
		.catch((error) => {
		console.error(error);
		});
	};


</script>

<main>
	<button  on:click|preventDefault={changeDir}  >Select folder</button>
	<div class="drop-here" on:drop|preventDefault={dropped} on:dragover|preventDefault={dragOver} on:dragleave|preventDefault={dragLeave}> 
		drop here
	</div>
	<h5>
		File : {pdfFile?.name || "not selected"}
	</h5>
	<h5>
		Folder : {distenation || "not selected"}
	</h5>
	<button  on:click|preventDefault={convert}  >Convert</button>
	<Link to="/">Home</Link>
</main>

<style>
	.drop-here{
		width: 150px;
		height: 150px;
		border: 2px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
</style>