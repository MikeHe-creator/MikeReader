<template>
  <div class="bg-gray-700 flex-col justify-center items-center flex w-[200px] h-[200px]">
    <img alt="loading" src="../Elements/gif/loading.gif" width="110" height="100">
    <p class="text-white">{{ loadingtext }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const loadingtext = ref('Patently wait, loading .')
const loadings = ['Patiently wait, loading .', 'Patiently wait, loading . .', 'Patiently wait, loading . . .']
let currentIndex = 0
let intervalId

function updateText() {
  currentIndex = (currentIndex + 1) % loadings.length
  loadingtext.value = loadings[currentIndex]
}

onMounted(() => {
  // 在客户端启动后，每3秒更新一次文字
  setInterval(updateText, 1000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>