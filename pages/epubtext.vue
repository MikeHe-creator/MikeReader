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
<div ref="bkcontent" @change="sendbook" class="flex flex-col overflow-auto w-screen h-[862px] relative top-[42px] " id="bkcontent" >
  <iframe ref="epubwb" class="break-words h-[1000px]" ></iframe>
</div>
<!--底部页码-->
<div class="bg-blue-800 fixed bottom-0 left-0 w-full h-[40px]">
  <div class="flex items-center justify-center mt-[6px]">
    <p>
      <input type="number" min="1" :max=totalPage class="w-12 text-right" value="1" ref="currentPage" @change="valuechange">
    </p>
    <p class="inline-block text-white">/</p>
    <p class="inline-block text-white">{{ totalPage }}</p>
  </div>
</div>
</template>

<script setup>
import {ref,onMounted} from 'vue';
import { useRoute } from 'vue-router';
import Loading from "~/pages/components/loading.vue";
import axios from "axios";

const route = useRoute();
const BookName=route.query.epubtextname;
const epubtextAddress=route.query.epubtextAddress
const bkcontent=ref();
const epubwb= ref();
if (BookName.endsWith('.epub')) {
  sendbook(epubtextAddress)
}

async function sendbook(epubtextAddress) {
  const response = await fetch(epubtextAddress);
  const blobData = await response.blob();
  const formData = new FormData();
  formData.append('book', blobData);
  await axios.post(`http://localhost:5000/sendepub`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
      .then(response => {
        if (response && response.data) {
          const bookmenu=response.data.bookmenu;
          const bookinfo=response.data.bookinfo;
          const bookcontent=response.data.bookcontent;
          const bookcss=response.data.css;
          const images=response.data.images;
          console.log('imagine',images)
          analysecontent(bookcontent,bookcss,images)
        }
      })
}

function analysecontent(bookcontent, bookcss, images) {
  // 使用Scoped CSS防止样式冲突
  const scopedCSS = bookcss.replace(/([^}{]*){/g, '#bkcontent $1{');
  const imageMap = {};
  images.forEach(image => {
    imageMap[image.file_name] = image.data;
  });

  // 获取iframe文档
  const iframeDoc = epubwb.value.contentDocument || epubwb.value.contentWindow.document;
  iframeDoc.open();

  // 写入基本HTML结构和样式，包括多栏布局样式
  iframeDoc.write(`
    <html>
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
    </html>
  `);
  iframeDoc.close();

  // 将内容插入iframe文档中
  bookcontent.forEach(item => {
    const div = iframeDoc.createElement('div');
    let htmlContent = item.html;

    // 将图片src替换为base64数据
    Object.keys(imageMap).forEach(fileName => {
      const base64Data = `data:image/*;base64,${imageMap[fileName]}`;
      htmlContent = htmlContent.replace(new RegExp(fileName, 'g'), base64Data);
    });

    div.innerHTML = htmlContent;
    iframeDoc.body.appendChild(div);
  });
}


</script>

<style scoped>

</style>