<template>
    <div class=" bg-gradient-to-r to-purple-500 from-red-300">
        <Headline></Headline>
        <p class=" mr-auto text-white opacity-10 ">ReaderCollect</p>
        <div class=" flex font-bold mt-[60px] ml-[5px] lg:ml-[20px] space-x-1 lg:space-x-3">
            <div class=" bg-orange-500 w-[90px] lg:w-[140px] text-center lg:text-[30px] cursor-pointer" @click="booklist1">Booklist</div>
            <div class=" bg-green-500 w-[80px] lg:w-[140px] text-center lg:text-[30px] cursor-pointer" @click="videolist1">Videolist</div>
            <div class=" bg-purple-500 w-[100px] lg:w-[150px]  text-center lg:text-[30px] cursor-pointer" @click="musiclist1">Muisclist</div>
            <div class=" bg-amber-500 w-[100px] lg:w-[160px]  text-center lg:text-[30px] cursor-pointer" @click="collection1">Collection</div>
        </div>
        <div class=" bg-orange-500 h-2" ref="colortie"></div>
    </div>
    <div class="relative h-screen overflow-hidden">
        <p class="text-gray-300 lg:text-[300px] text-[270px] ml-[300px] lg:mt-[400px] sm:mt-[300px] rotate-90 lg:rotate-0 z-[-10] relative">ReaderCollect</p>
    </div>
    <div>
        <button ref="showbutton1" @click="scanFolder1" class=" absolute lg:mt-[-930px] mt-[-800px] font-bold ml-[20px] bg-orange-500 border-[3px] rounded-[10px] border-orange-500 hover:border-orange-800 lg:p-4 p-2 block">Upload local book libary</button>
        <button ref="showbutton2" @click="scanFolder2" class=" absolute lg:mt-[-930px] mt-[-800px] font-bold ml-[20px] bg-green-500 border-[3px] rounded-[10px] border-green-500 hover:border-green-800 lg:p-4 p-2 hidden">Upload local video libary</button>
        <button ref="showbutton3" @click="scanFolder3" class=" absolute lg:mt-[-930px] mt-[-800px] font-bold ml-[20px] bg-purple-500 border-[3px] rounded-[10px] border-purple-500 hover:border-purple-800 lg:p-4 p-2 hidden">Upload local music libary</button>
        <div ref="showbutton4">
            <form name="webcollection">
                <input>
            </form>
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