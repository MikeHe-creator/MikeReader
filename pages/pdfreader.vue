<template>
  <div class="bg-black w-screen h-screen absolute z-[-10]" id="body">
    <!--加载动画-->
    <loading class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden" ref="loadImg"/>
    <!--头部标题-->
    <div class='bg-gray-800 h-[40px] flex items-center fixed w-screen'>
      <nuxt-link to="/" class="bg-blue-500 text-white text-[20px] rounded-[10px] text-center ml-[10px] w-[75px]">Home</nuxt-link>
      <nuxt-link to="BookReader" class="bg-blue-500 text-white text-[20px] rounded-[10px] text-center ml-[10px] w-[75px]">Back</nuxt-link>
      <p class="text-white ml-[10px]">{{ BookName }}</p>
    </div>
    <!--主体内容框-->
    <div ref="pdfcontent" @change="sendbook" class="flex flex-col items-center overflow-auto w-screen h-[862px] relative top-[42px] z-[-1]" id="pdfcontent" ></div>
    <!--底部页码-->
    <div class="bg-gray-800 fixed bottom-0 left-0 w-full h-[40px]">

      <div class="flex items-center justify-center mt-[6px]">
        <p>
          <input type="number" min="1" :max=totalPage class="w-12 text-right" value="1" ref="currentPage" @change="valuechange">
        </p>
        <p class="inline-block text-white">/</p>
        <p class="inline-block text-white">{{ totalPage }}</p>
      </div>
    </div>
    <!--左侧工具栏-->
    <pdftool v-if="pdfimg && outline" :pdfimg="pdfimg" :outline="outline" :pdfcontent="pdfcontent" :currentPage="currentPage"/>
  </div>
</template>
<script setup>
import {ref,onMounted} from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import Pdftool from "~/pages/components/pdftool.vue";
import Loading from "~/pages/components/loading.vue";

//导入文件信息
const route = useRoute();
const BookName=route.query.pdfname;
const pdfAddress=route.query.pdfAddress
sendbook(pdfAddress)

//导入文件
const pdfcontent=ref();
const totalPage=ref(0);
const pdfimg=ref();
const outline=ref();
async function sendbook(pdfAddress) {
  try {
    const response = await fetch(pdfAddress);
    const blobData = await response.blob();
    console.log(blobData)
    const formData = new FormData();
    formData.append('book', blobData);
    await axios.post(`http://localhost:5000/sendpdfs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(response => {
          if (response && response.data && response.data.image_paths) {
            pdfimg.value = response.data.image_paths;
            totalPage.value=pdfimg.value.length;
            outline.value = response.data.outline;
            console.log('pdfreader-outline',outline)
            pdfcon(pdfimg);
          } else {
            console.error('Error: Invalid response data');
          }
        })
  } catch (error) {
    console.error('Error sending book:', error);
  }
}

//展示pdf
function pdfcon(pdfimg){
  for(let single=0;single<pdfimg.value.length;single++){
    const pdfcanvas=document.createElement('canvas');
    pdfcanvas.style.marginBottom = '5px';
    const ctx = pdfcanvas.getContext('2d');
    const img = new Image();
    img.src =  `http://localhost:5000/${pdfimg.value[single]}`;
    console.log('图片地址：',img.src)
    img.onload =()=>{
      const imageWidth = img.width;
      const imageHeight = img.height;
      pdfcanvas.width = imageWidth;
      pdfcanvas.height = imageHeight;
      ctx.drawImage(img, 0, 0, pdfcanvas.width, pdfcanvas.height);
    }
    pdfcanvas.id = `canvas${single + 1}`;
    pdfcontent.value.appendChild(pdfcanvas);
  }
}

//页码定位
const currentPage=ref()
//翻动页面时改动页码值
function handleScroll() {
  const canvasnow = pdfcontent.value.getElementsByTagName('canvas');
  let firstCanvasId = null;
  for (let i = 0; i < canvasnow.length; i++) {
    const rect = canvasnow[i].getBoundingClientRect();
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      firstCanvasId = canvasnow[i].id;
      console.log("firstCanvasId",firstCanvasId)
      break;
    }
  }
  let idNumber = null;
  if (firstCanvasId) {
    idNumber = firstCanvasId.match(/\d+/)[0];
  }
  if (idNumber) {
    currentPage.value.value = parseInt(idNumber)+1;
    console.log('当前页码：', currentPage.value.value);
  } else {
    console.error("No canvas in view");
  }
}
//由页码定位页面
function valuechange(event){
  const value = parseInt(event.target.value);
  setTimeout(() => {
    currentPage.value.value = value;
  },10)
  const canvasID = `canvas${value}`;
  console.log('canvasID:',canvasID)
  const targetElement = document.getElementById(canvasID);
  if (targetElement) {
    const offsetTop = targetElement.offsetTop;
    pdfcontent.value.scrollTop = offsetTop === 0 ? 0 : offsetTop - pdfcontent.value.offsetTop;
  }
}

onMounted(() => {
  pdfcontent.value.addEventListener('scroll', handleScroll);
});
</script>
<style scoped>
#pdfcontent::-webkit-scrollbar {
  width: 8px;
}
#pdfcontent::-webkit-scrollbar-track {
  background: #000000;
  border-radius: 10px;
}
#pdfcontent::-webkit-scrollbar-thumb {
  background: rgb(80, 86, 96);
  border-radius: 10px;
}
</style>