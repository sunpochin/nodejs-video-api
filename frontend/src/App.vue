<script setup>
import LoginPart from './components/LoginPart.vue'
import MyCourses from './components/MyCourses.vue'
//import OldLogin from './components/LoginPart.vue'
</script>

<template>
  <div class="header">
    <LoginPart/>
  </div>
  <br>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 20px;
}

</style>
