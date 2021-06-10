<style>
main {
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>

<script lang="ts">
import Box from "../../Components/Box/Box.svelte";
</script>

<main>
  <a href="#/converttoimage" >
    <Box><h4>pdf to images</h4></Box>
  </a>
  <a href="#/ocr">
    <Box><h4>images to text</h4></Box>
  </a>
</main>
