<template>
<div class="w-screen h-screen" id="backgroundset">
  <div>
    <div class="bg-cyan-500 h-5"></div>
    <div class="bg-cyan-500 h-[30px]">
      <nuxt-link to="/" class="ml-[20px] text-2xl mt-[48px]">Home</nuxt-link>
      <nuxt-link class="ml-[20px] text-2xl mt-[48px] bg-cyan-200 rounded-t-[10px]">Book Reader</nuxt-link>
      <nuxt-link class="ml-[20px] text-2xl mt-[48px]">Video Player</nuxt-link>
      <nuxt-link class="ml-[20px] text-2xl mt-[48px]">Music Player</nuxt-link>
      <nuxt-link class="ml-[20px] text-2xl mt-[48px]">Collections</nuxt-link>
    </div>
    <div class="bg-cyan-200 h-[15px] w-full"></div>
    <div class="ml-[1850px] mt-[-60px] cursor-pointer z-3"><img class="w-10 h-10" alt="user" src="./Elements/svg/default_profile.svg"></div>
  </div>
  <div>
    <div class="w-[800px] h-[300px] bg-emerald-400 mt-[300px] ml-[540px]">
      <div>
        <img alt="reading together" src="./Elements/reading%20together.png" class="w-[300px] h-[300px]">
      </div>
      <div class="mt-[-220px] ml-[420px] ">
        <button class="w-[300px] h-[30px] bg-blue-500 rounded-[10px] mt-[-6px] font-bold" @click="files" >Upload form the local device</button><br>
        <input type="file" class="hidden" ref="upfiles" accept=".txt, .epub, .mobi, .pdf">
        <button class="w-[300px] h-[30px] bg-blue-500 rounded-[10px] mt-[10px] font-bold">Upload from Microsoft OneDrive</button><br>
        <button class="w-[300px] h-[30px] bg-blue-500 rounded-[10px] mt-[10px] font-bold">Upload from Google Drive</button>
        <button class="w-[300px] h-[30px] bg-blue-500 rounded-[10px] mt-[10px] font-bold">Upload from Baidu Netdisk</button>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
  import {ref} from 'vue';
  import { useRouter } from 'vue-router';

  //导入文件
  const upfiles=ref(null);
  const router = useRouter();
  function files() {
    upfiles.value.addEventListener('change', function(event) {
      const selectedFile = event.target.files[0];
      console.log('selectedFile in bookreader.vue :',selectedFile )
      const blobUrl = URL.createObjectURL(selectedFile);
      bookinfo(blobUrl,selectedFile)
    })
    upfiles.value.click();

    function bookinfo(blobUrl,selectedFile){
      if (selectedFile.name.endsWith('.pdf')) {
        router.push({ path: '/pdfreader', query: { pdfname:selectedFile.name, pdfAddress:blobUrl} });
      }
    }
  }
</script>
<style scoped>
#backgroundset{
  background-image:url("./Elements/reading together2.png") ;
  background-size: cover;
  background-attachment: fixed;
  animation: moveBackground 6s infinite;
}
@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -30px 0;
  }
  50% {
    background-position: -30px -30px;
  }
  75% {
    background-position: 0 -60px;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
