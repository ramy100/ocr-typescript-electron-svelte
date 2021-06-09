<script lang="ts">
import { Link } from "svelte-navigator";
import Box from "../../Components/Box/Box.svelte";


</script>
<main>
    <div class="container">
        <Link to="converttoImage">
            <Box></Box>
        </Link>
        <Link to="ocr">
            <Box></Box>
        </Link>
    </div>
</main>

<style>
    .container{
        display: grid;
        justify-content: center;
        gap: 40px;
        grid-template-columns: repeat(3,1fr);
    }
    main{
        height: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
</style>