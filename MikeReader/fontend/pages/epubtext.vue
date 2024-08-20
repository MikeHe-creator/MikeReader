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
    <div ref="epubwb" class="break-words h-[1000px] ml-[90px] border-solid border-b-gray-500 border-2"></div>
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
const bkcontent = ref();
const epubwb = ref();
const loadingCompleted = ref(false);
let totalPage=ref(0);
let ctPage=ref(1)
const currentPage = ref();

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

let percolumn=[];
async function loadContent(contentfiles, contentcss) {
  const {newfameWidth, columnWidth}=updateIframesWidth()
  console.log('columnWidth:',columnWidth)
  const promises = contentfiles.map(async (html, index) => {
    if (loadingCompleted.value) return; // 如果加载完成，退出循环
    const iframeElement = document.createElement('iframe');
    iframeElement.id = html.split('\\').pop().split('/').pop().replace('.html', '');
    iframeElement.width = `${window.innerWidth*0.95}`;
    iframeElement.height = '859';
    epubwb.value.appendChild(iframeElement);
    const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow.document;
    let cssContent = '';

    // 通过并行获取 CSS 文件内容
    const cssPromises = contentcss.map(async (cssFile) => {
      const response = await fetch(`http://localhost:5000/${cssFile}`);
      return await response.text();
    });
    const cssContents = await Promise.all(cssPromises);
    cssContent = cssContents.join('');

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
              width: ${newfameWidth}px;
              height: 861px;
              overflow: hidden;
              margin: 0px !important;
              padding: 20px 68px;
              box-sizing: border-box;
              max-width: inherit;
              column-fill: auto;
              column-gap: 136px;
              column-width: ${columnWidth}px;
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
        <body id="zhuyaolrong" class="vrtl"></body>
      </html>`
    );
    iframeDoc.close();

    // 加载 HTML 文件内容
    await dealcontent(html, iframeDoc);
    updateImages(iframeDoc);
    dealcolumn(iframeDoc,iframeElement,columnWidth,contentfiles);
  });

  await Promise.all(promises);
}

async function dealcontent(contentFile, iframeDoc) {
  const response = await fetch(`http://localhost:5000/${contentFile}`);
  const htmlContent = await response.text();
  const div = iframeDoc.createElement('div');
  div.innerHTML = htmlContent;
  div.id='shenti';
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

function updateIframesWidth() {
  const windowsize = window.innerWidth;
  const newfameWidth = windowsize * 0.9;

  let columnWidth;
  if (newfameWidth<900){
    columnWidth=newfameWidth
  }else{
    const padding = 68 * 2;
    const columnGap = 136;
    const contentWidth = newfameWidth - padding - columnGap;
    columnWidth = contentWidth * 0.5;
    console.log('columnWidth:',columnWidth)
  }
  //console.log('columnWidth:', columnWidth);
  document.querySelectorAll('iframe').forEach(iframe => {
    iframe.style.width = newfameWidth + 'px';
    // 动态更新 iframe 内部 body 的宽度和 column-width
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const body = iframeDoc.querySelector('body');
    if (body) {
      body.style.width = `${newfameWidth}px`
      body.style.columnWidth = `${columnWidth}px`;
    }
  });
  return {newfameWidth,columnWidth}
}

function dealcolumn(iframeDoc,iframeElement,columnWidth,contentfiles){
  console.log('columnWidth:',columnWidth)
  const originalDisplay = iframeElement.style.display;
  iframeElement.style.display = 'block';
  const shenti = iframeDoc.getElementById('shenti');
  const shentiStyle = iframeDoc.defaultView.getComputedStyle(shenti);
  const shentiHeight = parseFloat(shentiStyle.height);
  let totalColumn = shentiHeight / (columnWidth+136);
  console.log('totalColumn1',totalColumn)
  totalColumn = Math.max(Math.floor(totalColumn),1);
  percolumn.push(totalColumn);
  iframeElement.style.display = originalDisplay;
  calculateTotalPage(contentfiles);
}

let pageDict = {};
function calculateTotalPage(contentfiles) {
  console.log('percolumn:', percolumn);
  let currentPage = 1;

  // 获取所有 iframe 并遍历
  document.querySelectorAll('iframe').forEach((iframe, index) => {
    const iframeId = iframe.id; // 获取 iframe 的 id
    const columns = percolumn[index]; // 获取对应的列数

    // 根据列数和窗口宽度计算页面数
    let pageCount;
    if (window.innerWidth * 0.9 >= 900 && columns % 2 !== 0) {
      pageCount = columns + 1;
    } else {
      pageCount = columns;
    }

    // 更新 pageDict
    pageDict[iframeId] = currentPage;
    currentPage += pageCount;
  });
  console.log('pageDict:', pageDict);

  const lastArr = percolumn[percolumn.length - 1];
  const lastDict = Object.values(pageDict)[Object.values(pageDict).length - 1];
  totalPage.value = lastArr + lastDict;

  if (percolumn.length === contentfiles.length) {
    percolumn = [];
  }
  const iframes = document.querySelectorAll('iframe');
  const firstIframeId = iframes[0].id;
  iframes.forEach(iframe => {
    if (iframe.id !== firstIframeId) {
      iframe.style.display = 'none';
    }
  });
}

function changePage(step) {
  let currentPage2 = parseInt(ctPage.value) || 1;
  currentPage2 += step;
  if(currentPage2>totalPage.value || currentPage2<1){
    return;
  }else{
    ctPage.value = currentPage2;
  }

  const keys = Object.keys(pageDict);
  let closestKey = null;
  let minDiff = Infinity;
  let maxKey = null;
  let maxValue = -Infinity;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const pageValue = pageDict[key];
    if (pageValue > maxValue) {
      maxValue = pageValue;
      maxKey = key;
    }
    if (pageValue > currentPage2) {
      let diff = pageValue - currentPage2;
      if (diff < minDiff) {
        minDiff = diff;
        closestKey = key;
      }
    }
  }

  let keynum ;
  if (!closestKey) {
    closestKey = maxKey;
    keynum=keys.indexOf(closestKey)
  }else{
    keynum=keys.indexOf(closestKey)-1;
    closestKey=keys[keynum];
  }
  const clkey2 = document.getElementById(closestKey);
  console.log('clkey2:', clkey2);
  if (clkey2.style.display === 'block') {
    const shenti = clkey2.contentDocument.getElementById('shenti');
    console.log('shenti:', shenti);
    const currentTransform = shenti.style.transform;
    let translateX = 0;
    if (currentTransform && currentTransform.includes('translateX')) {
      translateX = parseFloat(currentTransform.match(/translateX\((-?\d+(\.\d+)?)px\)/)[1]);
    }
    const pageWidth = clkey2.contentWindow.innerWidth;
    translateX += (step > 0 ? -pageWidth : pageWidth);
    shenti.style.transform = `translateX(${translateX}px)`;
    console.log(`当前 translateX: ${translateX}px`);
  } else {
    clkey2.style.display = 'block';
    for (let i = 0; i < keys.length; i++) {
      const allkey = keys[i];
      if (i !== keynum) { // 使用索引判断而不是键值
        const otherElement = document.getElementById(allkey);
        if (otherElement) {
          otherElement.style.display = 'none';
        }
      }
    }
  }
}

window.addEventListener('resize', updateIframesWidth);
</script>

<style scoped>
</style>
