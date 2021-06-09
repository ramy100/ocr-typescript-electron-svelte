<style>
.box {
  width: 300px;
  height: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 1s;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box:hover {
  transform: scale(1.2);
  background-color: lightgoldenrodyellow;
}
</style>

<main>
  <div class="box">
    <div class="content">
      <slot />
    </div>
  </div>
</main>
