<style>
main {
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>

<script lang="ts">
import { Link } from "svelte-navigator";
import Box from "../../Components/Box/Box.svelte";
</script>

<main>
  <Link to="converttoImage">
    <Box><h4>pdf to images</h4></Box>
  </Link>
  <Link to="ocr">
    <Box><h4>images to text</h4></Box>
  </Link>
</main>
