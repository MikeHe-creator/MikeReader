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
    <div ref="epubwb" class="break-words h-[840px] ml-[90px] border-solid border-b-gray-500 border-2"></div>
  </div>
  <!--底部页码-->
  <div class="bg-blue-800 fixed bottom-0 left-0 w-full h-[40px]">
    <div class="flex items-center justify-center mt-[6px]">
      <button @click="changePage(-2)">◀️</button>
      <p class="text-white" ref="currentPage" min="1">{{ ctPage }}</p>
      <p class="inline-block text-white">/</p>
      <p class="inline-block text-white" >{{ totalPage }}</p>
      <button @click="changePage(2)">▶️</button>
    </div>
  </div>
  <!--左侧工具栏-->
  <!--pdftool-->
</template>
<script setup>
   import { ref } from 'vue';
   import { useRoute } from 'vue-router';
   import axios from 'axios';
   import Loading from "~/pages/components/loading.vue";
   import Pdftool from "~/pages/components/pdftool.vue";

   const route = useRoute();
   const BookName = route.query.epubtextname;
   const epubtextAddress = route.query.epubtextAddress;
   const imageMap = {};
   const epubwb=ref()

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
         const bookmenu = response.data.bookmenu;
         const tempfloder = response.data.tempfloder;
         const contentfiles = response.data.contentfiles;
         const contentcss = response.data.contentcss;
         const contentimg = response.data.contentimg;

         // 先对html数组进行排序
         contentfiles.sort((a, b) => {
           if (a.includes('cover') && !b.includes('cover')) return -1;
           if (!a.includes('cover') && b.includes('cover')) return 1;
           if (a.match(/\d+/) && b.match(/\d+/)) {
             return parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]);
           }
           return a.localeCompare(b);
         });
         createImageMap(contentimg).then(() => {
           loadFrames(contentfiles)
         });
       }
     });
   }

   async function createImageMap(contentimg) {
     for (const imageFile of contentimg) {
       const response = await fetch(`http://localhost:5000/${imageFile}`);
       const blob = await response.blob();
       const url = URL.createObjectURL(blob);

       // 统一路径分隔符为斜杠
       const normalizedImageFile = imageFile.replace(/\\/g, '/');
       const pathParts = normalizedImageFile.split('/');
       const fileName = pathParts[pathParts.length - 1];
       imageMap[fileName] = url;
       console.log('imageMap[fileName]:',imageMap[fileName])
     }
   }

   let percolumn=[];
   async function loadFrames(contentfiles){
     const promises = contentfiles.map(async (file, index) => {
       const newdiv=document.createElement('div');
       const newfame = document.createElement('iframe');
       newfame.id = file.split('\\').pop().split('/').pop().replace(/\.(html|htm|xhtml)$/i, '');
       //newdiv.innerHTML=`${newfame.id} 共有<p id="lanshu${index}" style="display: inline-block"></p>栏`;
       newfame.height = '840';
       newfame.width=`${window.innerWidth*0.95}`
       newfame.src=`http://localhost:5000/${contentfiles[index]}`;
       newdiv.appendChild(newfame);
       epubwb.value.appendChild(newdiv);
       newfame.onload = () => {
         fenlanForLoad(newfame);
       };
     });
     await Promise.all(promises);
   }

   function fenlanForResize() {fenlan()}
   function fenlanForLoad(newfame) {fenlan(newfame)}

   function fenlan(newfame = null){
     const newfamewidth=`${window.innerWidth*0.95}`;
     let columnGap, columnWidth;
     if(newfamewidth<900){
       columnWidth=newfamewidth;
       columnGap = 0;
     }else{
       const pinfenfame=newfamewidth*0.5;
       console.log('pinfenfame:',pinfenfame)
       const padding = 68
       columnGap=pinfenfame*0.14;
       columnWidth = pinfenfame - padding - columnGap;
     }
     const fames = newfame ? [newfame] : document.getElementsByTagName('iframe');
     console.log('fames:',fames)
     for (let i = 0; i < fames.length; i++) {
       console.log('fames[i]:',fames[i]);
       fames[i].width = `${window.innerWidth * 0.95}`;
       const fameDoc = fames[i].contentDocument || fames[i].contentWindow.document;
       console.log('fameDOC:',fameDoc);
       const htmlbody = fameDoc.getElementsByTagName('body')[0];
       htmlbody.style.cssText = `
            width: ${newfamewidth}px;
            height: 760px;
            overflow: auto;
            margin: 0px !important;
            padding: 20px 47px;
            box-sizing: border-box;
            max-width: inherit;
            column-fill: auto;
            column-gap: ${columnGap}px;
            column-width: ${columnWidth}px;
            color: rgb(63, 72, 74);
        `;
       //pagesnum(fameDoc);
     }
   }

   window.addEventListener('resize', ()=>{
     percolumn=[];
     fenlanForResize();
   });

</script>