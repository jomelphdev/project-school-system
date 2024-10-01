<template>
  <div class="main-container">
    <div class="sub-container">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sub-container {
  width: 80%;
  background: #fff;
  box-shadow: 0 2px 10px -4px #000;
  border-radius: 20px;
  align-self: center;
  margin: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}
</style>