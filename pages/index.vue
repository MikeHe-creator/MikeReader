<template>
  <div class="bg-blue-500 absolute inset-0">
    <div class="w-10 h-10 ml-[1800px] mt-[20px] cursor-pointer">
      <img alt="user" src="./Elements/svg/default_profile.svg">
    </div>
    <div class="mt-[-50px]">
      <p class="text-[90px] ml-[20px]" id="title"><span class="font-serif italic">Welcome to</span><span ref="title2" class="font-bold ml-[10px]">MikeReader</span></p>
    </div>
    <div class="w-[500px] h-[500px] ml-[150px] mt-[90px]" id="4pics">
      <img alt="book" src="./Elements/book.png" class="rounded-[20px] shadow-2xl shadow-gray-800" ref="book">
      <img alt="video" src="./Elements/video.png" class="rounded-[20px] shadow-2xl shadow-gray-800 hidden" ref="video">
      <img alt="music" src="./Elements/music.png" class="rounded-[20px] shadow-2xl shadow-gray-800 hidden" ref="music">
      <img alt="collection" src="./Elements/collection.png" class="rounded-[20px] shadow-2xl shadow-gray-800 hidden " ref="collection">
    </div>
    <div class="mt-[-450px] ml-[1000px]" id="button">
      <button class="text-6xl shadow-2xl shadow-blue-950 w-[400px] hover:bg-blue-200" id="button1"><NuxtLink to="BookReader">Book Reader</NuxtLink></button><br>
      <button class="text-6xl shadow-2xl shadow-blue-950 mt-12 w-[400px] hover:bg-blue-200" id="button2">Video Player</button><br>
      <button class="text-6xl shadow-2xl shadow-blue-950 mt-12 w-[400px] hover:bg-blue-200" id="button3">Music Player</button><br>
      <button class="text-6xl shadow-2xl shadow-blue-950 mt-12 w-[400px] hover:bg-blue-200" id="button4">Collection</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

//字体颜色随时间变化而变化
const title2 = ref(null);
const colors = ['red', 'blue', 'orange', 'amber', 'purple', 'pink','white', 'brown', 'green'];
let colorIndex = ref(0);
function colorch() {
  colorIndex.value = (colorIndex.value + 1) % colors.length;
  title2.value.style.color = colors[colorIndex.value];
}

//图片随时间变化而切换
const book=ref(null);
const video=ref(null);
const music=ref(null);
const collection=ref(null);
const images = [book, video, music, collection];
let picindex=ref(0);
function picchange(){
  images[picindex.value].value.style.display='none';
  picindex.value=(picindex.value+1)% images.length;
  images[picindex.value].value.style.display='block';
}

onMounted(() => {
  setInterval(colorch, 1000);
  setInterval(picchange, 3000);
});

</script>
