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
    <div ref="pdfpicture" @change="sendbook" class="flex flex-col items-center overflow-auto w-screen h-[862px] relative top-[42px] z-[-1]" id="pdfpicture" ></div>
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
    <pdftool v-if="pdffile && outline" :pdffile="pdffile" :outline="outline" :pdfpicture="pdfpicture" :currentPage="currentPage"/>
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
const pdfpicture=ref();
const totalPage=ref(0);
const pdffile=ref();
const outline=ref();
async function sendbook(pdfAddress) {
  try {
    const response = await fetch(pdfAddress);
    const blobData = await response.blob();
    console.log(blobData);
    const formData = new FormData();
    formData.append('book', blobData);
    await axios.post(`http://localhost:5000/sendpdfs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response && response.data) {
        pdffile.value = response.data.numpages;
        outline.value = response.data.outline;
        totalPage.value = pdffile.value.length;
        pdfcon(pdffile.value);
      } else {
        console.error('Error: Invalid response data');
      }
    });
  } catch (error) {
    console.error('Error sending book:', error);
  }
}

//展示pdf
function pdfcon(pdffile) {
  for (const index in pdffile) {
    const pdfdiv =document.createElement('div');
    pdfdiv.id=`pdfdiv${parseInt(index) + 1}`;
    const pdftuhua = document.createElement('img');
    pdftuhua.style.marginBottom = '5px';
    pdftuhua.alt = `img${parseInt(index) + 1}`;
    pdftuhua.id = pdftuhua.alt;
    pdftuhua.src = `_nuxt/Backendin/${pdffile[index]}`;
    console.log("存储路径", pdftuhua.src);
    pdfdiv.appendChild(pdftuhua);

    pdftuhua.onload = function() {
      const pdfcanvas = document.createElement('canvas');
      pdfcanvas.width = pdftuhua.width;
      pdfcanvas.height = pdftuhua.height;
      console.log("pdftuhua.height:",pdftuhua.height);
      pdfcanvas.id = `canvas${parseInt(index) + 1}`;

      // 应用到 canvas 上
      pdfcanvas.style.position = 'absolute';
      pdfdiv.appendChild(pdfcanvas);
      pdfpicture.value.appendChild(pdfdiv);

      // 动态调整 canvas 的位置和大小
      function adjustCanvas() {
        const marginLeft = pdftuhua.offsetLeft;
        const marginTop = pdftuhua.offsetTop;
        const width = pdftuhua.offsetWidth;
        const height = pdftuhua.offsetHeight;

        pdfcanvas.style.left = `${marginLeft}px`;
        pdfcanvas.style.top = `${marginTop}px`;
        pdfcanvas.width = width;
        pdfcanvas.height = height;
      }

      // 窗口大小改变时重新调整
      window.addEventListener('resize', adjustCanvas);

      // 首次加载时调整
      adjustCanvas();
    }
  }
}

//页码定位
const currentPage=ref()
//翻动页面时改动页码值
function handleScroll() {
  const imgnow = pdfpicture.value.getElementsByTagName('img');
  let firstimgId = null;
  for (let i = 0; i < imgnow.length; i++) {
    const rect = imgnow[i].getBoundingClientRect();
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      firstimgId = imgnow[i].id;
      break;
    }
  }
  let idNumber = null;
  if (firstimgId) {
    idNumber = firstimgId.match(/\d+/)[0];
  }
  if (idNumber) {
    currentPage.value.value = parseInt(idNumber)+1;
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
  const imgID = `img${value}`;
  console.log('imgID:',imgID)
  const targetElement = document.getElementById(imgID);
  if (targetElement) {
    const offsetTop = targetElement.offsetTop;
    pdfpicture.value.scrollTop = offsetTop === 0 ? 0 : offsetTop - pdfpicture.value.offsetTop;
  }
}

onMounted(() => {
  pdfpicture.value.addEventListener('scroll', handleScroll);
});

</script>
<style scoped>
#pdfpicture::-webkit-scrollbar {
  width: 8px;
}
#pdfpicture::-webkit-scrollbar-track {
  background: #000000;
  border-radius: 10px;
}
#pdfpicture::-webkit-scrollbar-thumb {
  background: rgb(80, 86, 96);
  border-radius: 10px;
}
</style>