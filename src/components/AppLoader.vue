<template>
  <div class="app-loader"
       style="background: rgba(0, 0, 0, 0.3); z-index: 2000">
    <div class="lds-ripple"><div></div><div></div></div>
  </div>
</template>

<script>
export default {
  name: "AppLoader"
}
</script>

<style lang="scss" scoped>

.app-loader{
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #1542a4;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 55px;
    left: 55px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 110px;
    height: 110px;
    opacity: 0;
  }
}
</style>