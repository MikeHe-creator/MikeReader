<template>
    <div class="flex flex-col items-center hidden">
      <div>
        <img src="./svg/male-avatar-4942266-4116910.gif" height="300" width="200">
      </div>
      <div class="ml-[0.5em]">
        <p class="text-white">Select a picture to set as your profile:</p>
        <button class="text-white bg-blue-500 w-[10em] rounded-2xl" @click="selectPicture">select a picture</button>
        <!-- 使用插值绑定选择的图片名称 -->
        <div class=" text-white">{{ selectedFileName }}</div>
        <input type="file" class="mt-[0.3em] hidden" ref="fileInput">
      </div>
      <div class="flex items-center justify-between">
        <div class="text-white cursor-pointer inline-block">&lt;&lt;PREVIOUS</div>
        <div class="flex-grow w-[6em]"></div>
        <div class="text-white cursor-pointer inline-block" @click="componentsnext">NEXT&gt;&gt;</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';

  const selectedFileName = ref('');
  const fileInputRef = ref();

  function selectPicture() {
    fileInputRef.value.addEventListener('change', handleFileChange);
    fileInputRef.value.click();
  }
  function handleFileChange(event) {
    const file = event.target.files[0];
    selectedFileName.value = file ? file.name : ''; 
  }
  import { onMounted } from 'vue';
  onMounted(() => {
    fileInputRef.value = document.querySelector('input[type="file"]');
  });

  </script>
  
