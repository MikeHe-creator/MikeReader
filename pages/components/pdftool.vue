<template>
  <div class="w-[50px] h-[820px] bg-gray-800 mt-[-800px] ml-[15px] rounded-[10px]">
    <button @click="catalog" ref="menu1"><img alt="catalog" src="../Elements/svg/clipboard-list-solid.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button @click="smallview"><img alt="pageview" src="../Elements/svg/viewpage.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button @click="pdfpen"><img alt="markerpen" src="../Elements/svg/markerpen.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button @click="pdfeasier"><img alt="easier" src="../Elements/svg/eraser.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button><img alt="text" src="../Elements/svg/text.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button><img alt="save" src="../Elements/svg/save.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button><img alt="translation" src="../Elements/svg/translation.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <div>
      <button><img alt="larger" src="../Elements/svg/larger.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
      <button><img alt="smaller" src="../Elements/svg/smaller.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px] hidden"></button>
    </div>
    <div>
      <button><img alt="fullscreen" src="../Elements/svg/fullscreen.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
      <button><img alt="backscreen" src="../Elements/svg/fullscreen-exit.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px] hidden"></button>
    </div>
  </div>
  <!--目录-->
  <div class="w-[400px] h-[820px] bg-gray-800 mt-[-820px] ml-[70px] rounded-[10px] hidden overflow-auto " ref="catalogbox" id="catalogbox">
    <div ref="menu2"></div>
    <div class="grid place-content-center"><div ref="suolvtu" ></div></div>
  </div>
  <!--pdf笔迹-->
  <div class="bg-gray-800 w-[400px] h-[200px] mt-[-800px] ml-[70px] rounded-[10px] hidden" ref="pdfpens">
    <div class="flex items-center" ref="pencolor"><p class="text-white ml-[10px] mt-[10px]">The Color :</p><input type="color" class="ml-[6px] mt-[10px] bg-transparent" value="#ffff00"/></div>
    <div>
      <p class="text-white ml-[10px] mt-[10px]">The Line :</p>
      <div ref="pdfline" class="mt-[-20px] grid place-content-center"><svg width="250px" xmlns="http://www.w3.org/2000/svg"><path id="curve" d="M10 50 C 40 10, 140 90, 190 50" stroke="yellow" stroke-width="2" fill="none"/></svg></div>
    </div>
    <div class="text-white mt-[-65px] ml-[10px]">
      <p class="inline-block">Thin</p>
      <input type="range" min="1" max="28" class="ml-[4px] w-[200px]" value="14">
      <p class="inline-block ml-[4px]">Thick</p>
    </div>
    <div class="mt-[5px] text-white ml-[10px]" ref="pentoumin">
      <p class="inline-block" >Should be transparent?</p><input type="radio" class="inline-block ml-[10px]" name="transparentOption">Yes<input type="radio" class="inline-block ml-[10px]" name="transparentOption" checked>No
    </div>
  </div>
  <!--pdf画笔光标-->
  <div></div>
</template>
<script setup>
import { ref, onMounted } from "vue";

const catalogbox = ref();
const menu1 = ref();
const menu2 = ref();
const suolvtu = ref();
const props = defineProps(['pdfimg', 'outline', "pdfcontent","currentPage"]);
console.log('props-pdftool:', props.outline);

//目录：
onMounted(() => {
  if (props.outline.length === 0 && menu1.value) {
    menu1.value.style.display = 'none';
  }
  pdfcatal()
  suolvtuf()
});
function pdfcatal(){
  props.outline.forEach(item => {
    const title = item[1];
    const page = item[2];
    const directory = document.createElement('p');
    directory.innerHTML = `<p class="mt-[4px] ml-[6px] hover:bg-gray-500 text-white cursor-pointer" id="content${page}">${title}</p>`;
    menu2.value.appendChild(directory);
  });
}
function catalog() {
  if (catalogbox.value.style.display === 'block') {
    catalogbox.value.style.display = 'none';
  } else {
    catalogbox.value.style.display = 'block';
    pdfpens.value.style.display='none';
  }
  suolvtu.value.style.display='none';
  menu2.value.style.display='block';
  menu2.value.addEventListener('click',menujump)
}

//缩略图
function smallview(){
  if (catalogbox.value.style.display==='block'){
    catalogbox.value.style.display='none';
  }else{
    catalogbox.value.style.display='block';
    pdfpens.value.style.display='none';
  }
  suolvtu.value.style.display='block';
  menu2.value.style.display='none';
}
function suolvtuf() {
  for (let single = 0; single < props.pdfimg.length; single++) {
    const pdfcanvas = document.createElement('canvas');
    pdfcanvas.style.marginBottom = '5px';
    const ctx = pdfcanvas.getContext('2d');
    const img = new Image();
    img.src = `http://localhost:5000/${props.pdfimg[single]}`;
    img.onload = () => {
      const imageWidth = img.width * 0.26;
      const imageHeight = img.height * 0.26;
      pdfcanvas.width = imageWidth;
      pdfcanvas.height = imageHeight;
      ctx.drawImage(img, 0, 0, pdfcanvas.width, pdfcanvas.height);
    }
    pdfcanvas.id = `solvtu${single + 1}`;
    suolvtu.value.appendChild(pdfcanvas);

    // 创建 p 元素
    const pElement = document.createElement('p');
    pElement.textContent = `${single + 1}`;
    pElement.style.color='white';
    pElement.style.textAlign='center';
    // 将 p 元素添加到每个 canvas 后面
    pdfcanvas.insertAdjacentElement('afterend', pElement);
  }
  suolvtu.value.addEventListener('click',slvtujump)
}

//目录跳转
function menujump(event){
    if (event.target.tagName === 'P') {
      const pid = event.target.getAttribute('id');
      const pageMatch = pid.match(/content(\d+)/);
      const pageNumber = parseInt(pageMatch[1]);
      setTimeout(() => {
        props.currentPage.value = pageNumber;
      }, 10);
      const targetid = `canvas${pageNumber}`;
      const targetElement = document.getElementById(targetid);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop;
        props.pdfcontent.scrollTop = offsetTop === 0 ? 0 : offsetTop - props.pdfcontent.offsetTop;
      }
    }
}

//缩略图跳转
function slvtujump(event){
  const canvasid = event.target.getAttribute('id');
  const pageMatch = canvasid.match(/solvtu(\d+)/);
  const pageNumber = parseInt(pageMatch[1]);
  const targetid = `canvas${pageNumber}`;
  setTimeout(() => {
    props.currentPage.value = pageNumber;
  }, 10);
  const targetElement = document.getElementById(targetid);
  if (targetElement) {
    const offsetTop = targetElement.offsetTop;
    props.pdfcontent.scrollTop = offsetTop === 0 ? 0 : offsetTop - props.pdfcontent.offsetTop;
  }
}

//高级功能--笔迹
const pdfpens=ref()
const pencolor=ref();
const pentoumin=ref();

function pdfpen(){
  //props.pdfcontent.style.cursor='url(../Elements/svg/cursorPen.svg) 0 30,auto'
  if (pdfpens.value.style.display==='none'){
    pdfpens.value.style.display='block';
    catalogbox.value.style.display='none';
  }else{
    pdfpens.value.style.display='none';
  }

  //获取颜色：
  const colorInput = document.querySelector('input[type="color"]');
  const thicknessSlider = document.querySelector('input[type="range"]');
  const svgPath = document.getElementById('curve');
  colorInput.addEventListener('change', function(event) {
    const selectedColor = event.target.value;
    console.log('Selected color:', selectedColor);
    svgPath.setAttribute('stroke', selectedColor);
  });
  thicknessSlider.addEventListener('input', function(event) {
    const thicknessValue = event.target.value;
    console.log('Selected thickness:', thicknessValue);
    svgPath.setAttribute('stroke-width', thicknessValue);
  });
}

//高级功能--笔迹擦除
</script>
<style scoped>
#catalogbox::-webkit-scrollbar {
  width: 8px;
}
#catalogbox::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}
#catalogbox::-webkit-scrollbar-thumb {
  background: rgb(80, 86, 96);
  border-radius: 10px;
}
</style>