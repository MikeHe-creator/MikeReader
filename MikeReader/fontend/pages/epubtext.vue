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
    <div ref="epubwb" class="break-words h-[1000px] ml-[250px]"></div>
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
const bkcontent = ref();
const epubwb = ref();
const loadingCompleted = ref(false);

const imageMap = {}; // 全局的 imageMap

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
        loadContent(contentfiles, contentcss);
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
  }
}

async function loadContent(contentfiles, contentcss) {
  for (const html of contentfiles) {
    if (loadingCompleted.value) break; // 如果加载完成，退出循环

    const iframeElement = document.createElement('iframe');
    iframeElement.id = html.split('\\').pop().split('/').pop().replace('.html', '');
    iframeElement.width = '1632';
    iframeElement.height = '859';
    if (index === 0) {
      iframeElement.style.display = 'block';
    } else {
      iframeElement.style.display = 'none';
    }
    epubwb.value.appendChild(iframeElement);

    const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow.document;

    let cssContent = '';
    for (const cssFile of contentcss) {
      const response = await fetch(`http://localhost:5000/${cssFile}`);
      cssContent += await response.text();
    }

    // 使用更精确的正则表达式处理 CSS 内容
    const scopedCSS = cssContent.replace(/([^}{]*){/g, (match, p1) => {
      if (p1.trim().startsWith('.vrtl')) {
        return `${p1}{`;
      } else {
        return `#bkcontent ${p1}{`;
      }
    });

    // 加载 HTML 内容到 iframeDoc
    iframeDoc.open();
    iframeDoc.write(
        `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ja">
        <head>
          <style>
            ${scopedCSS}
            body {
              width: 1632px;
              height: 861px;
              overflow-y: hidden;
              margin: 0px !important;
              padding: 20px 68px;
              box-sizing: border-box;
              max-width: inherit;
              column-fill: auto;
              column-gap: 136px;
              column-width: 680px;
              color: rgb(63, 72, 74);
            }
            img {
              object-fit: contain;
              break-inside: avoid;
              box-sizing: border-box;
              max-width: 390px !important;
              max-height: 780px !important;
            }
          </style>
        </head>
        <body id="bkcontent" class="vrtl"></body>
      </html>`
    );
    iframeDoc.close();

    // 加载 HTML 文件内容
    await dealcontent(html, iframeDoc);
    updateImages(iframeDoc);
    if (contentfiles.indexOf(html) === contentfiles.length - 1) {
      loadingCompleted.value = true;
    }
  }
}

async function dealcontent(contentFile, iframeDoc) {
  const response = await fetch(`http://localhost:5000/${contentFile}`);
  const htmlContent = await response.text();
  const div = iframeDoc.createElement('div');
  div.innerHTML = htmlContent;
  iframeDoc.body.appendChild(div);
}

function updateImages(iframeDoc) {
  const images = iframeDoc.getElementsByTagName('img');
  for (const img of images) {
    const src = img.getAttribute('src');
    const normalizedSrc = src.replace(/\\/g, '/');
    const pathParts = normalizedSrc.split('/');
    const fileName = pathParts[pathParts.length - 1];
    if (imageMap[fileName]) {
      img.setAttribute('src', imageMap[fileName]);
    } else {
      console.error(`Image not found in map: ${fileName}`);
    }
  }

  const svgImages = iframeDoc.getElementsByTagName('image');
  for (const img of svgImages) {
    const href = img.getAttribute('xlink:href');
    const pathParts = href.split('/');
    const fileName = pathParts[pathParts.length - 1];
    if (imageMap[fileName]) {
      img.setAttribute('xlink:href', imageMap[fileName]);
    }
  }
}
</script>

<style scoped>
</style>
