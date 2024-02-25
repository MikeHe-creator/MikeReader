<template>
    <div class="relative h-screen overflow-hidden">
        <p class="text-gray-300 lg:text-[300px] text-[270px] ml-[300px] lg:mt-[400px] sm:mt-[300px] rotate-90 lg:rotate-0 -z-10 relative">ReaderCollect</p>
    </div>
    <div class="absolute inset-0">
        <div class=" bg-gradient-to-r to-purple-500 from-red-300">
            <Headline></Headline>
            <div class=" grid grid-flow-col auto-cols-min mt-[0.5em] lg:mt-[3em] ml-[0.3em]">
               <div class=" bg-orange-500 text-center lg:text-[30px] cursor-pointer" @click="booklist1">Booklist</div>
               <div class=" bg-green-500 min-w-[0.2em] lg:w-[140px] text-center lg:text-[30px] cursor-pointer" @click="videolist1">Videolist</div>
               <div class=" bg-purple-500 min-w-[0.2em] lg:w-[150px]  text-center lg:text-[30px] cursor-pointer" @click="musiclist1">Muisclist</div>
               <div class=" bg-amber-500 min-w-[0.2em] lg:w-[160px]  text-center lg:text-[30px] cursor-pointer" @click="collection1">Collection</div>
            </div>
        </div>
        <div class=" bg-orange-500 h-2" ref="colortie"></div>
        <div class="flex">
            <button ref="showbutton1" @click="scanFolder1" class=" absolute mt-[0.5em] font-bold ml-[0.5em] bg-orange-500 border-[3px] rounded-[10px] border-orange-500 hover:border-orange-800 lg:p-4 p-2 block z-0">Upload local book library</button>
            <button ref="showbutton2" @click="scanFolder2" class=" absolute mt-[0.5em] font-bold ml-[0.5em] bg-green-500 border-[3px] rounded-[10px] border-green-500 hover:border-green-800 lg:p-4 p-2 hidden z-0">Upload local video libary</button>
            <button ref="showbutton3" @click="scanFolder3" class=" absolute mt-[0.5em] font-bold ml-[0.5em] bg-purple-500 border-[3px] rounded-[10px] border-purple-500 hover:border-purple-800 lg:p-4 p-2 hidden z-0">Upload local music libary</button>
            <div ref="showbutton4">
                <form name="webcollection">
                   <input>
                   </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const colortie=ref();
const showbutton1=ref();
const showbutton2=ref();
const showbutton3=ref();
const showbutton4=ref();
function booklist1(){
    colortie.value.style.backgroundColor="rgb(249 115 22)"
    showbutton1.value.style.display = "block";
    showbutton2.value.style.display = "none";
    showbutton3.value.style.display = "none";
    showbutton4.value.style.display = "none";    
};   
function videolist1(){
    colortie.value.style.backgroundColor="rgb(34 197 94)"
    showbutton1.value.style.display = "none";
    showbutton2.value.style.display = "block";
    showbutton3.value.style.display = "none";
    showbutton4.value.style.display = "none"; 
};
function musiclist1(){
    colortie.value.style.backgroundColor="rgb(168 85 247)" 
    showbutton1.value.style.display = "none";
    showbutton2.value.style.display = "none";
    showbutton3.value.style.display = "block";
    showbutton4.value.style.display = "none";   
};
function collection1(){
    colortie.value.style.backgroundColor="rgb(245 158 11)"
    showbutton1.value.style.display = "none"; 
    showbutton2.value.style.display = "none"; 
    showbutton3.value.style.display = "none"; 
    showbutton4.value.style.display = "block"; 
};

</script>