<template>
  <div class="relative h-screen overflow-hidden">
    <p class="text-gray-200 lg:text-[300px] text-[270px] ml-[450px] lg:mt-[400px] sm:mt-[300px] rotate-90 lg:rotate-0 -z-10 relative">Bookreader</p>
  </div>
  <div class="absolute inset-0">
    <div class=" bg-gradient-to-r to-orange-500 from-orange-200">
      <Headline></Headline>
      <h1 class="ml-[0.5em] mt-[0.4em] text-[2em] bg-orange-500 max-w-[5.7em] text-center">Bookreader</h1>
    </div>
    <div class=" bg-orange-500 h-2 lg:h-3"></div>
    <div>
      <div>
        <button class=" mt-[2em] lg:ml-[4em] border-orange-400 border-[3px] hover:border-orange-800" @click="uptobook">
          <p class=" font-bold bg-orange-400 w-[9em]">Upload the book</p>
        </button>
        <input type="file" ref="inputbook" accept=".txt, .epub, .mobi, .pdf" class="hidden"><div class=" inline-block ml-[1em]">{{ bookname }}</div>
      </div>
      <div>
        <div class=" bg-orange-100 lg:max-w-[85em] h-[3em] ml-[6em] mt-[1em] flex-col flex justify-center">
          <button @click="showcontents"><img src="./icons/svg/menu-svgrepo-com.svg" class=" w-[25px] h-[25px] ml-[0.5em]"></button>
        </div>
        <div class="bg-black lg:max-w-[85em] h-[41em] ml-[6em] flex justify-center  overflow-auto" ref="display">
            <div class="flex justify-center items-start ">
              <div ref="pdfCanvas" class=""></div>
            </div>
        </div>
        <div ref="contents" class="bg-gray-800 lg:w-[20em] h-[41em] z-10 absolute mt-[-41em] ml-[6em]">
          <p class="text-white text-[1.5em] ml-[0.5em] font-bold inline-block" ref="menucon">Content List</p>
          <p class="hidden text-white text-[1.5em] ml-[0.5em] font-bold" ref="pages">Content View</p>
          <button ref="tridown" class="ml-[2em] brightness-0 invert inline-block" @click="translist"><img src="./icons/svg/triangle-down.svg" class="w-[2em] h-[2em]"></button>
          <div class="border border-white w-[20em]"></div>
          <div ref="idcontents" class=" text-white h-[38.3em] overflow-y-auto"></div>
          <div ref="idpage" class="hidden"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref } from "vue";

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
          //目录
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
              directory.innerHTML = `<p class=" mt-[4px] hover:bg-gray-500 cursor-pointer" id="content${page}">${title}</p>`;
              idcontents1.appendChild(directory);
            });
          }
          jumppage(idcontents1,pdfimg);
          //阅读
          const pdfCanvas1=pdfCanvas.value;
          while (pdfCanvas1.firstChild) {
            pdfCanvas1.removeChild(pdfCanvas1.firstChild);
          }
          pdfimg.forEach((imageData, index) => {
            let canvas = document.createElement('canvas');
            canvas.style.marginBottom = '5px';
            const ctx = canvas.getContext('2d');
            pdfCanvas1.appendChild(canvas);
            const img = new Image();
            img.src = 'data:image/png;base64,' + imageData;
            img.onload = () => {
              const imageWidth = img.width;
              const imageHeight = img.height;
              canvas.width = imageWidth;
              canvas.height = imageHeight;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              canvas.id=`canvas${index+1}`
            }
            if (index === pdfimg.length - 1) {
              console.log("All PDF pages are displayed.");
            }
          })
        });
  } catch (error) {
    console.error(`Meet a problem to deal with the pdf ${bookname.value} contents:`, error);
  }
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

function jumppage(idcontents1,pdfimg){
  const totalpage=pdfimg.length;
  const displayval=display.value
  console.log(totalpage);
  idcontents1.addEventListener('click',function (event){
    if (event.target.tagName === 'P') {
      const pid = event.target.getAttribute('id');
      const pageMatch = pid.match(/content(\d+)/);
      const pageNumber = parseInt(pageMatch[1]);
      const targetid = `canvas${pageNumber}`;
      const targetElement = document.getElementById(targetid);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop;
        displayval.scrollTop = offsetTop === 0 ? 0 : offsetTop - displayval.offsetTop;
      }
    }
  })
}
</script>