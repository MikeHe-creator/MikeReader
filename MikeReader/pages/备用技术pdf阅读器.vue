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
            <div class=" mt-[2em] lg:ml-[10em]">
                <!--pdf阅读器-->
                <embed type="application/pdf" src="" ref="pdfCanvas" width="1600" height="680" controls="false" class="bg-black" >
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";

const bookname=ref();
const inputbook=ref();
const contents=ref();
const pages=ref();
const setting=ref();
const pdfCanvas=ref();

function uptobook() {
    inputbook.value.addEventListener('change', handleFileChange);
    inputbook.value.click();
}

function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    bookname.value = selectedFile ? selectedFile.name : '';
    viewpdf(selectedFile);
}
function viewpdf(selectedFile){
  const pdfCanvas1=pdfCanvas.value;
  if (!selectedFile) return;
  const blobUrl = URL.createObjectURL(selectedFile);
  pdfCanvas1.setAttribute('src', blobUrl);
}

</script>