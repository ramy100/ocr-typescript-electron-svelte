<style lang="scss">
.bar {
  height: 80px;
  border: 1px solid black;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.progress {
  width: var(--progress-val);
  height: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr;
  transition: all 0.3s;
  text-align: center;
  background-color: rgb(43, 187, 86);
}
</style>

<script lang="ts">
export let value;
</script>

<main>
  <div class="bar">
    <slot />
    <div style="--progress-val:{value}%" class="progress"></div>
  </div>
</main>
