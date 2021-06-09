<script lang="ts">
export let value
</script>
<main>
    <div  class="bar">
        <h5>
            <slot></slot>
        </h5>
        <div style="--progress-val:{value}%" class="progress">
        </div>
    </div>
</main>

<style >
    .bar{
        width: 50%;
        height: 30px;
        border: 1px solid black;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        background-color: gray;
    }
    .progress{
        width: var(--progress-val);
        height: 100%;
        background-color: rgb(17, 194, 17);
        display: grid;
        justify-content: center;
        align-items: center;
        grid-template-columns: 1fr;
        transition: all .3s;
        
    }
    h5{
        color: white;
        position: absolute;
    }
</style>