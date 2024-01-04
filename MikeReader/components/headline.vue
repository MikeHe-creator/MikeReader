<template>
    <div>
         <div class=" lg:hidden sm:block bg-blue-600 bg-opacity-20 "><p class="text-white text-[40px] ml-[10px] cursor-pointer" @click="touchevent">≡</p></div>
    </div>
        <div class=" hidden lg:flex">
            <NuxtLink to="BookReader" class="ml-[10px] text-[20px] text-white">📚BookReader</NuxtLink>
            <NuxtLink to="videoplayer" class="ml-[10px] text-[20px] text-white">💿Videoplayer</NuxtLink>
            <NuxtLink to="CDplayer" class="ml-[10px] text-[20px] text-white">🎶CDplayer</NuxtLink>
            <NuxtLink to="ReaderCollect" class="ml-[10px] text-[20px] text-white">💾ReaderCollect</NuxtLink>
            <NuxtLink to="history" class="ml-[10px] text-[20px] text-white">⏱History</NuxtLink>
        </div>
        <!--Only for small screens-->
        <div v-if="isMenuVisible" class="bg-blue-600 bg-opacity-20 z-10 p-4 backdrop-blur-lg fixed w-1/2 h-full flex-col ">
            <NuxtLink to="BookReader" class="ml-2 text-white text-base m-1">📚BookReader</NuxtLink><br>      
           <NuxtLink to="videoplayer" class="ml-2 text-white text-base m-1">💿Videoplayer</NuxtLink><br>
           <NuxtLink to="CDplayer" class="ml-2 text-white text-base m-1">🎶CDplayer</NuxtLink><br>
           <NuxtLink to="ReaderCollect" class="ml-2 text-white text-base m-1">💾ReaderCollect</NuxtLink><br>
           <NuxtLink to="history" class="ml-2 text-white text-base m-1">⏱History</NuxtLink>
        </div>
</template>
<script setup>
import { ref } from "vue";
const localpop=ref();
const isMenuVisible = ref(false);
const touchevent = () => {
  isMenuVisible.value = !isMenuVisible.value;
};
</script>