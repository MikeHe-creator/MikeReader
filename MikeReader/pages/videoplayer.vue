<template>
    <p>jsdgf:</p>
    <button type="button" @click="displayeye">
      <img :src="eyesvg"> asdfhhjgjdgsf
    </button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const images = {
    normal: '@/components/svg/svgviewer-output.svg',
    toggled: '@/components/svg/svgviewer-output (1).svg'
  };
  
  const eyesvg = ref(images.normal);
  
  function displayeye() {
    // 切换图像
    eyesvg.value = eyesvg.value === images.normal ? images.toggled : images.normal;
  }
  </script>
  