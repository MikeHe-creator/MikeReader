<template>
  <div>
    <div>
      <button class=" mt-[2em] lg:ml-[4em] border-orange-400 border-[3px] hover:border-orange-800" @click="uptobook">
        <p class=" font-bold bg-orange-400 w-[9em]">Upload the book</p>
      </button>
      <input type="file" ref="inputbook" accept=".txt, .epub, .mobi, .pdf" class="hidden"><div class=" inline-block ml-[1em]">{{ bookname }}</div>
    </div>
    <div>
      <div class="bg-orange-100 mx-[2em] h-[3em] mt-[1em] flex items-center">
        <button @click="showcontents"><img src="./svg/menu-svgrepo-com.svg" class="w-[25px] h-[25px] ml-[0.5em]" alt="menubutton"></button>
        <div class="flex-grow text-center">
          <p class="inline-block">
            <input type="number" min="1" :max=totalPage class="w-12 text-right" value="1" ref="currentPage" @change="valuechange">
          </p>
          <p class="inline-block">/</p>
          <p class="inline-block">{{ totalPage }}</p></div>
        </div>
      <div class="bg-black mx-[2em] h-[36em] overflow-auto" ref="display">
        <div class="flex justify-center items-start ">
          <div ref="pdfCanvas"></div>
        </div>
      </div>
      <div ref="contents" class="absolute bg-gray-800 ml-[2em] h-[36em] max-w-[20em] mt-[-36em] z-1 lg:block sm:hidden">
        <p class="text-white text-[1.5em] ml-[0.5em] font-bold inline-block" ref="menucon">Content List</p>
        <p class="hidden text-white text-[1.5em] ml-[0.5em] font-bold" ref="pages">Content View</p>
        <button ref="tridown" class="ml-[2em] brightness-0 invert inline-block bg-gray-700/[.5] mt-[0.2em]" @click="translist"><img src="./svg/gua_transform.svg" class="w-[2em] h-[2em] text-white" alt="transform"></button>
        <div class="border border-white max-w-[18em]"></div>
        <div ref="idcontents" class=" text-white h-[33em] overflow-y-auto"></div>
        <div ref="idpage" class="hidden h-[33em] overflow-y-auto" ></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import {ref} from "vue";

const bookname=ref();
const inputbook=ref();
const menucon=ref();
const contents=ref();
const pages=ref();
const idcontents=ref();
const pdfCanvas=ref();
const idpage=ref();
const tridown=ref();
const display=ref();
const pdfroom=[];
const currentPage=ref();
const totalPage=ref();

function uptobook() {
  inputbook.value.addEventListener('change', handleFileChange);
  inputbook.value.click();
}

function handleFileChange(event) {
  const selectedFile = event.target.files[0];
  console.log('Selected file:', selectedFile);
  bookname.value = selectedFile ? selectedFile.name : '';
  sendbook(selectedFile,bookname);
}

async function sendbook(selectedFile,bookname) {
  console.log("book information: ", selectedFile);
  try {
    const formData = new FormData();
    formData.append('book', selectedFile);
    await axios.post(`http://localhost:5000/sendpdfs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(response => {
          const pdfimg=response.data.viewpdf;
          const outline = response.data.outline;
          const idcontents1=idcontents.value;
          pdfroom.length=0;//清空之前加载pdf文件
          for(let pdf in pdfimg){
            pdfroom.push(pdfimg[pdf])
          }
          icontents(outline,idcontents1);
          pdfimgs(pdfroom);
          totalPage.value=pdfroom.length;
        });
  } catch (error) {
    console.error(`Meet a problem to deal with the pdf ${bookname.value} contents:`, error);
  }
}

function icontents(outline,idcontents1){
  if (outline.length === 0){
    idpage.value.style.display="block";
    idcontents.value.style.display="none";
    pages.value.style.display="inline-block";
    menucon.value.style.display="none";
    tridown.value.style.display="none";
  }else{
    idpage.value.style.display="none";
    idcontents.value.style.display="block";
    pages.value.style.display="none";
    menucon.value.style.display="inline-block";
    tridown.value.style.display="inline-block";
    idcontents1.innerHTML = '';
    outline.forEach(item => {
      const title = item[1];
      const page = item[2];
      const directory = document.createElement('p');
      directory.innerHTML = `<p class="mt-[4px] hover:bg-gray-500 cursor-pointer" id="content${page}">${title}</p>`;
      idcontents1.appendChild(directory);
    });
  }
  jumppage(idcontents1);
}

function pdfimgs(pdfroom) {
  const pdfCanvas1 = pdfCanvas.value;
  const idpageval=idpage.value;
  // 清空旧 PDF 内容
  pdfCanvas1.innerHTML = '';
  idpageval.innerHTML = '';
  // 计数器用于跟踪图像加载完成的数量
  let imagesLoaded = 0;
  pdfroom.forEach((imageData, index) => {
    let canvas = document.createElement('canvas');
    let parentDiv = document.createElement('div');
    let canvas2 = document.createElement('canvas');
    canvas.style.marginBottom = '5px';
    canvas2.style.marginBottom = '5px';
    const ctx = canvas.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    pdfCanvas1.appendChild(canvas);
    parentDiv.appendChild(canvas2);
    const img = new Image();
    img.src = 'data:image/png;base64,' + imageData;
    img.onload = () => {
      const imageWidth = img.width;
      const imageHeight = img.height;
      canvas.width = imageWidth;
      canvas2.width = imageWidth * 0.3;
      canvas.height = imageHeight;
      canvas2.width = imageWidth * 0.3;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
      canvas.id = `canvas${index + 1}`;
      canvas2.id = `canvas2_${index + 1}`;
      parentDiv.style.cssText = `margin-top: 4px; cursor: pointer; display: flex; justify-content: center; align-items: center;`;
      parentDiv.addEventListener('mouseenter', () => {
        parentDiv.style.backgroundColor = 'rgb(107, 114, 128)';
      });
      parentDiv.addEventListener('mouseleave', () => {
        parentDiv.style.backgroundColor = 'transparent';
      });
      imagesLoaded++;
      idpageval.append(parentDiv)
      // 如果所有图像都加载完成，则输出信息
      if (imagesLoaded === pdfroom.length) {
        canvasjump(idpageval);
        display.value.addEventListener('scroll', currentpdf);
        console.log("All PDF pages are displayed.");
      }
    };
  });
}

function showcontents(){
  showornot(contents);
}
function showornot(contents){
  if (contents.value.style.display==="block"){
    contents.value.style.display="none";
  }else{
    contents.value.style.display="block";
  }
}
function translist(){
  if (menucon.value.style.display==="inline-block"){
    menucon.value.style.display='none';
    idcontents.value.style.display="none";
    idpage.value.style.display="block";
    pages.value.style.display="inline-block";
  }else{
    menucon.value.style.display='inline-block';
    idcontents.value.style.display="block";
    idpage.value.style.display="none";
    pages.value.style.display="none";
  }
}

function jumppage(idcontents1){
  const displayval=display.value
  idcontents1.addEventListener('click',function (event){
    if (event.target.tagName === 'P') {
      const pid = event.target.getAttribute('id');
      const pageMatch = pid.match(/content(\d+)/);
      const pageNumber = parseInt(pageMatch[1]);
      setTimeout(() => {
        currentPage.value.value = pageNumber;
      }, 10);
      const targetid = `canvas${pageNumber}`;
      const targetElement = document.getElementById(targetid);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop;
        displayval.scrollTop = offsetTop === 0 ? 0 : offsetTop - displayval.offsetTop;
      }
    }
  })
}
function canvasjump(idpageval){
  const displayval=display.value
  idpageval.addEventListener('click', function(event) {
    const canvasid = event.target.getAttribute('id');
    const pageMatch = canvasid.match(/canvas2_(\d+)/);
    const pageNumber = parseInt(pageMatch[1]);
    const targetid = `canvas${pageNumber}`;
    setTimeout(() => {
      currentPage.value.value = pageNumber;
    }, 10);
    const targetElement = document.getElementById(targetid);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop;
      displayval.scrollTop = offsetTop === 0 ? 0 : offsetTop - displayval.offsetTop;
    }
  });
}

function currentpdf(){
  const displayval=display.value
  const canvases = displayval.getElementsByTagName('canvas');
  let firstCanvasId = null;
  for (let i = 0; i < canvases.length; i++) {
    const rect = canvases[i].getBoundingClientRect();
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      firstCanvasId = canvases[i].id;
      break;
    }
  }
  // 提取id中的数字部分
  let idNumber = null;
  if (firstCanvasId) {
    idNumber = firstCanvasId.match(/\d+/)[0];
  }
  // 更新显示当前canvas id的元素内容
  if (idNumber) {
    currentPage.value.value = idNumber;
  } else {
    console.error("No canvas in view");
  }
}

function valuechange(event) {
  const displayval = display.value;
  const value = parseInt(event.target.value);
  console.log("value:",value);
  setTimeout(() => {
    currentPage.value.value = value;
  }, 10);
  const canvasID = `canvas${value}`;
  console.log('canvasID:',canvasID)
  const targetElement = document.getElementById(canvasID);
  if (targetElement) {
    const offsetTop = targetElement.offsetTop;
    displayval.scrollTop = offsetTop === 0 ? 0 : offsetTop - displayval.offsetTop;
  }
}
</script>