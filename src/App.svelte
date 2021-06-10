<style>
:global(*) {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
:global(html, body) {
  height: 100%;
}
main {
  height: 100%;
}
</style>

<script lang="ts">
import Home from "./Containers/Home/Home.svelte";
import Router from 'svelte-spa-router'
import ConverToImage from "./Containers/ConvertToImages/ConverToImage.svelte";
import Ocr from "./Containers/Ocr/Ocr.svelte";

const routes = {
    '/': Home,
    "/converttoimage":ConverToImage,
    "/ocr":Ocr
}
</script>

<main>
  <Router routes={routes} />
</main>
