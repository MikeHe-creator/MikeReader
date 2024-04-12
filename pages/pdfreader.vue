<template>
<div class="bg-black w-screen h-screen" id="body">
  <!--头部标题-->
  <div class='bg-gray-800 h-[40px] flex items-center fixed w-screen'>
    <nuxt-link to="/" class="bg-blue-500 text-white text-[20px] rounded-[10px] text-center ml-[10px] w-[75px]">Home</nuxt-link>
    <nuxt-link to="BookReader" class="bg-blue-500 text-white text-[20px] rounded-[10px] text-center ml-[10px] w-[75px]">Back</nuxt-link>
    <p class="text-white ml-[10px]">{{ BookName }}</p>
  </div>
  <!--主体内容框-->
  <div ref="pdfcontent" @change="sendbook" class="flex flex-col items-center overflow-auto w-screen h-[862px] relative top-[42px]" id="pdfcontent"></div>
  <!--底部页码-->
  <div class="bg-gray-800 fixed bottom-0 left-0 w-full h-[40px]">
    <div>
      <button class="bg-blue-500 text-white text-[20px] rounded-[10px] text-center ml-[10px] w-[80px] mt-[5px]">Prev</button>
    </div>
    <div class="flex items-center justify-center mt-[-30px]">
      <p>
        <input type="number" min="1" :max=totalPage class="w-12 text-right" value="1" ref="currentPage" @change="valuechange">
      </p>
      <p class="inline-block text-white">/</p>
      <p class="inline-block text-white">{{ totalPage }}</p>
    </div>
    <div class="flex items-center justify-end" >
      <button class="bg-blue-500 text-white text-[20px] rounded-[10px] text-center w-[87px] mt-[-26px] mr-[10px]">Next</button>
    </div>
  </div>
  <!--左侧工具栏-->
  <pdftool/>
</div>
</template>
<script setup>
import {ref} from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import Pdftool from "~/pages/components/pdftool.vue";

//导入文件信息
const route = useRoute();
const BookName=route.query.pdfname;
const pdfAddress=route.query.pdfAddress
sendbook(pdfAddress)

//导入文件
const pdfcontent=ref();
const totalPage=ref(0);
async function sendbook(pdfAddress) {
  try {
    const response = await fetch(pdfAddress);
    const blobData = await response.blob();
    console.log(blobData)// 获取 Blob 数据
    const formData = new FormData();
    formData.append('book', blobData); // 将 Blob 数据添加到 FormData 中
    await axios.post(`http://localhost:5000/sendpdfs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(response => {
          console.log("response:", response); // 添加调试信息
          if (response && response.data && response.data.image_paths) {
            const pdfimg = response.data.image_paths;
            totalPage.value=pdfimg.length;
            console.log("pdfimg:", pdfimg);
            //const outline = response.data.outline;
            pdfcon(pdfimg);
          } else {
            console.error('Error: Invalid response data'); // 添加调试信息
          }
        })
  } catch (error) {
    console.error('Error sending book:', error);
  }
}

//展示pdf
function pdfcon(pdfimg){
  for(let single=0;single<pdfimg.length;single++){
    const pdfcanvas=document.createElement('canvas');
    pdfcanvas.style.marginBottom = '5px';
    const ctx = pdfcanvas.getContext('2d');
    const img = new Image();
    img.src =  `http://localhost:5000/${pdfimg[single]}`;
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