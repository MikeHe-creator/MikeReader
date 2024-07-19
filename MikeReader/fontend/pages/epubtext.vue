<template>
  <!--加载动画-->
  <loading class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden" ref="loadImg"/>
  <!--头部标题-->
  <div class='bg-blue-800 h-[40px] w-screen flex items-center absolute'>
    <nuxt-link to="/" class="bg-blue-500 text-white text-[20px] rounded-[10px] text-center ml-[10px] w-[75px]" @click="lefthere">Home</nuxt-link>
    <nuxt-link to="BookReader" class="bg-blue-500 text-white text-[20px] rounded-[10px] text-center ml-[10px] w-[75px]"  @click="lefthere">Back</nuxt-link>
    <p class="text-white ml-[10px]">{{ BookName }}</p>
  </div>
  <!--主体内容框-->
  <div ref="bkcontent" class="flex flex-col overflow-auto w-screen h-[862px] relative top-[42px]" id="bkcontent">
    <iframe ref="epubwb" class="break-words h-[1000px]"></iframe>
  </div>
  <!--底部页码-->
  <div class="bg-blue-800 fixed bottom-0 left-0 w-full h-[40px]">
    <div class="flex items-center justify-center mt-[6px]">
      <p>
        <input type="number" min="1" :max="totalPage" class="w-12 text-right" value="1" ref="currentPage" @change="valuechange">
      </p>
      <p class="inline-block text-white">/</p>
      <p class="inline-block text-white">{{ totalPage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Loading from "~/pages/components/loading.vue";
import axios from "axios";

const route = useRoute();
const BookName = route.query.epubtextname;
const epubtextAddress = route.query.epubtextAddress;
const bkcontent = ref();
const epubwb = ref();

if (BookName.endsWith('.epub')) {
  sendbook(epubtextAddress);
}

async function sendbook(epubtextAddress) {
  const response = await fetch(epubtextAddress);
  const blobData = await response.blob();
  const formData = new FormData();
  formData.append('book', blobData);
  await axios.post('http://localhost:5000/sendepub', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    if (response && response.data) {
      console.log(response.data)
      const bookmenu = response.data.bookmenu;
      const tempfloder = response.data.tempfloder;
      const contentfiles = response.data.contentfiles;
      const contentcss = response.data.contentcss;
      const contentimg = response.data.contentimg;
      console.log('contentimg: ', contentimg);
      loadContent(contentfiles, contentcss, contentimg);
    }
  });
}

async function loadContent(contentfiles, contentcss, contentimg) {
  const iframeDoc = epubwb.value.contentDocument || epubwb.value.contentWindow.document;
  iframeDoc.open();

  let cssContent = '';
  for (const cssFile of contentcss) {
    const response = await fetch(`http://localhost:5000${cssFile}`);
    cssContent += await response.text();
  }
  const scopedCSS = cssContent.replace(/([^}{]*){/g, '#bkcontent $1{');

  iframeDoc.write(
      `<html>
      <head>
        <style>
          ${scopedCSS}
          body {
            width: 1151px;
            height: 861px;
            overflow-y: hidden;
            margin: 0px !important;
            padding: 20px 47px;
            box-sizing: border-box;
            max-width: inherit;
            column-fill: auto;
            column-gap: 94px;
            column-width: 481.5px;
            color: rgb(63, 72, 74);
          }
        </style>
      </head>
      <body id="bkcontent"></body>
    </html>`
  );
  iframeDoc.close();

  for (const contentFile of contentfiles) {
    const response = await fetch(`http://localhost:5000${contentFile}`);
    const htmlContent = await response.text();

    const div = iframeDoc.createElement('div');
    div.innerHTML = htmlContent;
    iframeDoc.body.appendChild(div);
  }
1
  // 将图片src替换为临时文件的路径
  const imageMap = {};
  for (const imageFile of contentimg) {
    const response = await fetch(`http://localhost:5000${imageFile}`);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    imageMap[imageFile] = objectURL;
  }

  const images = iframeDoc.getElementsByTagName('img');
  for (const img of images) {
    const src = img.getAttribute('src');
    if (imageMap[src]) {
      img.setAttribute('src', imageMap[src]);
    }
  }
}
</script>

<style scoped>
</style>
