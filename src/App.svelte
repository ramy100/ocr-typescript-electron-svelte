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
import Tools from "./Containers/Tools/Tools.svelte";
import { Router, Route, Link } from "svelte-navigator";
import ConverToImage from "./Containers/ConvertToImages/ConverToImage.svelte";
import Ocr from "./Containers/Ocr/Ocr.svelte";
import Home from "./Containers/Home/Home.svelte";
</script>

<main>
  <Router>
    <Route path="/">
      <Home />
    </Route>
    <Route path="converttoImage">
      <ConverToImage />
    </Route>
    <Route path="ocr">
      <Ocr />
    </Route>
  </Router>
</main>
