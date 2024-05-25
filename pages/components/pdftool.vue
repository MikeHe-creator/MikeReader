<template>
  <div class="w-[50px] h-[820px] bg-gray-800 mt-[-800px] ml-[15px] rounded-[10px]">
    <button @click="catalog" ref="menu1"><img alt="catalog" src="../Elements/svg/clipboard-list-solid.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button @click="smallview"><img alt="pageview" src="../Elements/svg/viewpage.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button @click="checkButton('huizhi')"><img alt="markerpen" src="../Elements/svg/markerpen.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button @click="checkButton('xiangpi')"><img alt="easier" src="../Elements/svg/eraser.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button @click="checkButton('zhushi')"><img alt="text" src="../Elements/svg/text.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button @click="saveasPDF"><img alt="save" src="../Elements/svg/save.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button><img alt="translation" src="../Elements/svg/translation.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button><img alt="doublepage" src="../Elements/svg/doublepage.svg" width="50" height="50" class="invert-[100%] ml-[-3px] mt-[6px]"></button>
    <button><img alt="larger" src="../Elements/svg/larger.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
    <button><img alt="smaller" src="../Elements/svg/smaller.svg" width="30" height="30" class="invert-[100%] ml-[6px] mt-[6px]"></button>
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
  <!--pdf笔迹和橡皮-->
  <div class="bg-gray-800 w-[400px] h-[210px] mt-[-800px] ml-[70px] rounded-[10px] hidden" ref="bixiangpi" @change="pdfpens1">
    <div ref="penfunc">
      <div class="flex items-center"><p class="text-white ml-[10px] mt-[10px]">The Color :</p>
        <input type="color" class="ml-[6px] mt-[10px] bg-transparent" value="#ffff00" @change="pencolor"/>
      </div>
      <div>
        <p class="text-white ml-[10px] mt-[10px]">The Line :</p>
        <div ref="pdfline2" class="mt-[-20px] grid place-content-center"><svg width="250px" xmlns="http://www.w3.org/2000/svg"><path id="curve" d="M10 50 C 40 10, 140 90, 190 50" :stroke="svgcolor" :stroke-width="svgwidth" fill="none"/></svg></div>
      </div>
      <div class="text-white mt-[-65px] ml-[10px]" >
        <p class="inline-block">The Opacity</p>
        <input type="range" min="1" max="100" class="ml-[4px] w-[200px]" value="100" id="toumingdu" @change="touminginput">
        <p class="inline-block ml-[4px]">{{ OPvalue }}%</p>
      </div>
    </div>
    <div class="flex-col items-center hidden" ref="circle">
      <svg width="100" height="100" class="ml-[150px] mt-[40px]">
        <circle cx="50" cy="50" :r="penline" stroke="white" stroke-width="2" fill="none" stroke-dasharray="5,5" />
      </svg>
    </div>
    <div class="text-white mt-[10px] ml-[10px]">
      <p class="inline-block">Thin</p>
      <input type="range" min="1" max="28" class="ml-[4px] w-[200px]" value="14" id="cuxidu" @change="getpenline">
      <p class="inline-block ml-[4px]">Thick</p>
    </div>
  </div>

</template>
<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const catalogbox = ref();
const menu1 = ref();
const menu2 = ref();
const suolvtu = ref();
const props = defineProps(['pdffile', 'outline', "pdfpicture","currentPage"]);
console.log('props-pdftool:', props.pdfpicture);

function pdfcatal(){
  props.outline.forEach(item => {
    const title = item[1];
    const page = item[2];
    const directory = document.createElement('p');
    directory.innerHTML = `<p class="mt-[4px] ml-[6px] hover:bg-gray-500 text-white cursor-pointer" id="content${page}">${title}</p>`;
    menu2.value.appendChild(directory);
  });
}

onMounted(() => {
  if (props.outline.length === 0 && menu1.value) {
    menu1.value.style.display = 'none';
  }
  pdfcatal();
  suolvtuf();
});

function catalog() {
  if (catalogbox.value.style.display === 'block') {
    catalogbox.value.style.display = 'none';
  } else {
    catalogbox.value.style.display = 'block';
    bixiangpi.value.style.display='none';
  }
  suolvtu.value.style.display='none';
  menu2.value.style.display='block';
  menu2.value.addEventListener('click',menujump);
}

//缩略图
function smallview(){
  if (catalogbox.value.style.display==='block'){
    catalogbox.value.style.display='none';
  }else{
    catalogbox.value.style.display='block';
    bixiangpi.value.style.display='none';
  }
  suolvtu.value.style.display='block';
  menu2.value.style.display='none';
}

function suolvtuf() {
  for (const index in props.pdffile) {
    const pdftuhua = document.createElement('img');
    pdftuhua.style.marginBottom = '5px';
    pdftuhua.alt = `solvtu${parseInt(index) + 1}`;
    pdftuhua.id = pdftuhua.alt;
    pdftuhua.src = `_nuxt/Backendin/${props.pdffile[index]}`;
    pdftuhua.onload = function() {
      const scalewidth=pdftuhua.width*0.23;
      const scaleheight=pdftuhua.width*0.23;
      pdftuhua.width=scalewidth;
      pdftuhua.height=scaleheight;
    }
    suolvtu.value.appendChild(pdftuhua);

    // 创建 p 元素
    const pElement = document.createElement('p');
    pElement.textContent = `${parseInt(index) + 1}`;
    pElement.style.color='white';
    pElement.style.textAlign='center';
    // 将 p 元素添加到每个 canvas 后面
    pdftuhua.insertAdjacentElement('afterend', pElement);
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
    const targetid = `img${pageNumber}`;
    const targetElement = document.getElementById(targetid);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop;
      props.pdfpicture.scrollTop = offsetTop === 0 ? 0 : offsetTop - props.pdfpicture.offsetTop;
    }
  }
}

//缩略图跳转
function slvtujump(event){
  const picid = event.target.getAttribute('id');
  const pageMatch = picid.match(/solvtu(\d+)/);
  const pageNumber = parseInt(pageMatch[1]);
  const targetid = `img${pageNumber}`;
  setTimeout(() => {
    props.currentPage.value = pageNumber;
  }, 10);
  const targetElement = document.getElementById(targetid);
  if (targetElement) {
    const offsetTop = targetElement.offsetTop;
    props.pdfpicture.scrollTop = offsetTop === 0 ? 0 : offsetTop - props.pdfpicture.offsetTop;
  }
}

//高级功能
let currentHandler = null;
let currentClickHandler = null;
const OPvalue=ref(100);
const svgcolor=ref('#ffff00');
const svgwidth=ref(2);
const penfunc=ref();
const circle=ref();
const bixiangpi=ref();
let colorvalue='';
let penline=15;
let rgba;
let penClickCount = 0;
let eraserClickCount = 0;

function checkButton(buttonName) {
  if (currentHandler) {
    document.removeEventListener('mouseover', currentHandler);
    currentHandler = null;
  }
  if (currentClickHandler) {
    document.removeEventListener('click', currentClickHandler);
    currentClickHandler = null;
  }

  if (buttonName === 'huizhi') {
    penClickCount++;
    if (penClickCount % 2 === 1) {
      bixiangpi.value.style.display = 'block';
      penfunc.value.style.display = 'block';
    } else {
      bixiangpi.value.style.display = 'none';
      penfunc.value.style.display = 'none';
    }
    circle.value.style.display = 'none';
    currentHandler = PenMouseOver;
  } else if (buttonName === 'xiangpi') {
    eraserClickCount++;
    penfunc.value.style.display = 'none';
    if (eraserClickCount % 2 === 1) {
      bixiangpi.value.style.display = 'block';
      circle.value.style.display = 'block';
    } else {
      bixiangpi.value.style.display = 'none';
      circle.value.style.display = 'none';
    }
    currentHandler = EraserMouseOver;
  } else if (buttonName === 'zhushi') {
    bixiangpi.value.style.display = 'none';
    penfunc.value.style.display = 'none';
    circle.value.style.display = 'none';
    currentHandler = TextMouseOver;
  }

  if (currentHandler) {
    document.addEventListener('mouseover', currentHandler);
  }
}

let piccursor=false;
function PenMouseOver(event) {
  if (event && event.target && event.target.tagName.toLowerCase() === 'canvas') {
    const thiscanvas = event.target;
    thiscanvas.style.cursor = 'url(_nuxt/pages/Elements/svg/cursorPen.svg), auto';
    piccursor=true;
    penpaint1(thiscanvas,penline,rgba);
  }
}

function EraserMouseOver(event) {
  if (event && event.target && event.target.tagName.toLowerCase() === 'canvas') {
    const thiscanvas = event.target;
    thiscanvas.style.cursor = 'url(_nuxt/pages/Elements/svg/eraser-rusor.svg) 0 30, auto';
    piccursor=true;
    penpaint2(thiscanvas,penline);
  }
}

function TextMouseOver(event) {
  if (event && event.target && event.target.tagName.toLowerCase() === 'canvas') {
    const thiscanvas = event.target;
    thiscanvas.style.cursor = 'text';
    piccursor=false;
    thiscanvas.addEventListener('click', (event)=>textdiv(event,thiscanvas));
  }
}

//高级功能--画笔和橡皮
function pdfpens1(){
  rgba=finalcolor();
}

function getpenline(event) {
  penline=event.target.value;
  svgwidth.value=penline;
  return penline
}

function  finalcolor(){
  //console.log('opacity2',opacity2);
  return `rgba(${r},${g},${b},${opacity2})`
}

let opacity2=1;
function touminginput(event){
  OPvalue.value=event.target.value;
  const opacity1=event.target.value;
  opacity2=opacity1/100;
  return opacity2
}

let r=255,g=255,b=255;
function pencolor(event){
  colorvalue=event.target.value;
  svgcolor.value=colorvalue;
  const hex = colorvalue.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  r = (bigint >> 16) & 255;
  g = (bigint >> 8) & 255;
  b = bigint & 255;
  return r,g,b
}

function penpaint1(thiscanvas,penline,rgba){
  const ctx = thiscanvas.getContext('2d');
  ctx.strokeStyle=rgba;
  console.log('ctx.strokeStyle',ctx.strokeStyle);
  ctx.lineWidth = penline;
  ctx.globalCompositeOperation="source-over";
  let isDrawing = false;
  startpaint(isDrawing,ctx,thiscanvas)
}

function penpaint2(thiscanvas,penline){
  const ctx = thiscanvas.getContext('2d');
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = penline;
  let isDrawing = false;
  startpaint(isDrawing,ctx,thiscanvas)
}

function startpaint(isDrawing, ctx, thiscanvas) {
  let lastX = 0;
  let lastY = 0;
  let points = [];

  thiscanvas.addEventListener('mousedown', startDrawing);
  thiscanvas.addEventListener('mousemove', draw);
  thiscanvas.addEventListener('mouseup', stopDrawing);
  thiscanvas.addEventListener('mouseout', stopDrawing);

  function startDrawing(event) {
    isDrawing = true;
    points = [];
    const { offsetX, offsetY } = event;
    [lastX, lastY] = [offsetX, offsetY];
    points.push({ x: offsetX, y: offsetY });
  }

  function draw(event) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event;
    points.push({ x: offsetX, y: offsetY });
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        points[points.length - 1].x,
        points[points.length - 1].y
    );
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
    points = [];
  }
}

//高级功能--注释
let pCount = 1;
const defaultText = 'please text here...';
let currentElementP = null;
let currentInputOprate = null;
const createdElements = [];
let lastScrollTop=0

props.pdfpicture.addEventListener('scroll',weeldown);
function weeldown() {
  lastScrollTop = props.pdfpicture.scrollTop;
  return lastScrollTop
}

function textdiv(event, thiscanvas) {
  if (piccursor) return;
  const texttarget = thiscanvas.parentNode;
  //const defaultText =`我是${texttarget.id}的孩子`
  const wenzidiv = document.createElement('div');
  const elementP = document.createElement('p');
  elementP.id = `comment${pCount}`;
  elementP.className=`comentClass(${thiscanvas.id})`;
  console.log("elementP.class",elementP.class);
  elementP.innerText = defaultText;
  elementP.contentEditable = 'true';

  const rect = texttarget.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY + lastScrollTop -25;
  console.log("(event.clientX,event.clientY)", `(${event.clientX},${event.clientY})`);
  console.log('(x,y)', `(${x}, ${y})`);

  // 检查是否已存在在此位置的 elementP
  for (const el of createdElements) {
    const elX = parseFloat(el.style.left);
    const elY = parseFloat(el.style.top);
    if (elX === x && elY === y) {
      return; // 如果存在，直接返回，不创建新元素
    }
  }

  elementP.style.top = `${y}px`;
  elementP.style.left = `${x}px`;
  elementP.style.position = 'absolute';
  elementP.style.zIndex = 5;
  elementP.style.backgroundColor = 'transparent';
  elementP.style.color = 'gray';
  elementP.addEventListener('focus', function () {
    if (elementP.innerText === defaultText) {
      elementP.innerText = '';
      elementP.style.color = 'black'; // 改变文本颜色
    }
  });
  wenzidiv.appendChild(elementP);
  pCount++;
  texttarget.appendChild(wenzidiv);

  const inputOprate = document.createElement('div');
  inputOprate.style.position = 'absolute';
  inputOprate.style.left = parseFloat(elementP.style.left) + 'px';
  inputOprate.style.top = (parseFloat(elementP.style.top) - 40) + 'px';
  inputOprate.style.backgroundColor = 'white';
  inputOprate.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.2)';
  inputOprate.style.width = '250px';
  inputOprate.style.height = '35px';
  createOprate(inputOprate, elementP);
  inputOprate.id = `operate${pCount}`;
  inputOprate.style.display = 'none';
  wenzidiv.appendChild(inputOprate);
  texttarget.appendChild(wenzidiv);
  pCount++;

  // 记录创建的 elementP
  createdElements.push(elementP);

  elementP.addEventListener('click', function (e) {
    e.stopPropagation();
    setEditable(elementP, inputOprate);
  });

  inputOprate.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  document.addEventListener('click', function () {
    setUneditable(elementP, inputOprate);
  });

  function setEditable(elementP, inputOprate) {
    if (currentElementP && currentElementP !== elementP) {
      setUneditable(currentElementP, currentInputOprate);
    }
    elementP.contentEditable = 'true';
    elementP.focus();
    inputOprate.style.display = 'block';
    currentElementP = elementP;
    currentInputOprate = inputOprate;
  }

  function setUneditable(elementP, inputOprate) {
    elementP.contentEditable = 'false';
    inputOprate.style.display = 'none';
  }
}

function createOprate(inputOprate, elementP) {
  const fontstyle = document.createElement('select');
  fontstyle.name = 'fontstyle';
  const option1 = document.createElement('option');
  option1.text = 'normal';
  option1.value = 'normal';
  fontstyle.appendChild(option1);
  const option2 = document.createElement('option');
  option2.text = 'Italic';
  option2.value = 'Italic';
  fontstyle.appendChild(option2);
  fontstyle.style.marginLeft = '5px';
  fontstyle.style.marginTop = '3px';
  fontstyle.style.border = 'none';
  inputOprate.appendChild(fontstyle);

  const fontsize = document.createElement('input');
  fontsize.type = 'number';
  fontsize.min = 4;
  fontsize.max = 70;
  fontsize.value = 11;
  fontsize.style.width = '45px';
  fontsize.style.marginLeft = '5px';
  fontsize.style.marginTop = '3px';
  fontsize.style.border = 'none';
  inputOprate.appendChild(fontsize);

  const fontcolor = document.createElement("input");
  fontcolor.type = 'color';
  fontcolor.style.marginLeft = '8px';
  fontcolor.style.marginTop = '3px';
  fontcolor.style.border = 'none';
  inputOprate.appendChild(fontcolor);

  const buttond = document.createElement('button');
  const buttoni = document.createElement('img');
  buttoni.alt = 'delete';
  buttoni.src = '_nuxt/pages/Elements/svg/rubbish-bin.svg'
  buttoni.width = 20;
  buttoni.height = 20;
  buttond.appendChild(buttoni);
  buttond.style.marginLeft = '5px';
  buttond.style.marginTop = '3px';
  buttond.style.border = 'none';
  inputOprate.appendChild(buttond);

  buttond.addEventListener('click', function () { inputOprate.parentNode.remove(); });
  fontstyle.addEventListener('change', function () { elementP.style.fontStyle = fontstyle.value; });
  fontcolor.addEventListener('change', function () { elementP.style.color = fontcolor.value; });
  fontsize.addEventListener('change', function () { elementP.style.fontSize = fontsize.value + 'px'; });
}

//另存为
function saveasPDF(){
  const dataps=collectDataP();
  const datacanvas=collectDataCanvas();

  axios.post('http://localhost:5000/sendP', {
    data:dataps
  })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));

  axios.post('http://localhost:5000/sendCanvas', {
    data:datacanvas
  })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
}

function collectDataCanvas(){
  const allcanvas=document.querySelectorAll("canvas");
  const datacanvas=[];
  allcanvas.forEach((yuansu) => {
    const context = yuansu.getContext('2d');
    const canvasData = context.getImageData(0, 0, yuansu.width, yuansu.height).data;

    let hasContent = false;
    for (let i = 0; i < canvasData.length; i += 4) {
      if (canvasData[i + 3] !== 0) { // Check the alpha value
        hasContent = true;
        break;
      }
    }

    if (hasContent) {
      const dataURL = yuansu.toDataURL('image/png');
      datacanvas.push({
        id: yuansu.id,
        dataURL: dataURL
      });
    }
  })
  return datacanvas;
}

function collectDataP(){
  const allps = document.querySelectorAll("p");
  const dataps = [];

  allps.forEach(function(element) {
    if (element.id.includes("comment")) {
      console.log('element', element);

      const elementClass = element.getAttribute("class");
      const style = window.getComputedStyle(element);
      const styleObject = {
        top: style.getPropertyValue("top"),
        left: style.getPropertyValue("left"),
        position: style.getPropertyValue("position"),
        zIndex: style.getPropertyValue("z-index"),
        backgroundColor: style.getPropertyValue("background-color"),
        color: style.getPropertyValue("color"),
        fontStyle: style.getPropertyValue("font-style"),
        fontSize: style.getPropertyValue("font-size"),
      };
      const text = element.innerText;
      const dataP = {
        style: styleObject,
        text: text,
        class: elementClass,
      };
      dataps.push(dataP);
    }
  })
  console.log(dataps);
  return dataps;
}

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