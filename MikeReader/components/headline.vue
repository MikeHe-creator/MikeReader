<template>
    <div>
      <div class=" lg:hidden sm:block"><p class="text-white text-[40px] ml-[10px] cursor-pointer" @click="touchevent">≡</p></div>
    </div>
    <div class=" hidden lg:flex">
        <NuxtLink to="/" class="ml-[1%] text-[20px] text-white mt-[1.5%]">🏠Home</NuxtLink>
        <NuxtLink to="BookReader" class="ml-[1%] text-[20px] text-white mt-[1.5%] ">📚BookReader</NuxtLink>
        <NuxtLink to="videoplayer" class="ml-[1%] text-[20px] text-white mt-[1.5%]">💿Videoplayer</NuxtLink>
        <NuxtLink to="CDplayer" class="ml-[1%] text-[20px] text-white mt-[1.5%]">🎶CDplayer</NuxtLink>
        <NuxtLink to="ReaderCollect" class="ml-[1%] text-[20px] text-white mt-[1.5%]">💾ReaderCollect</NuxtLink>
        <NuxtLink to="history" class="ml-[1%] text-[20px] text-white mt-[1.5%]">⏱History</NuxtLink>
        <div class="flex mt-[0.55%] ml-auto">
          <div class="bg-blue-800 m-3 rounded-[10px] w-[90px] h-[30px] inline-block">
            <NuxtLink to="register" class="text-[20px] text-white text-center ml-[8%]">register</NuxtLink>
          </div>
         <div class="bg-blue-800 m-3 rounded-[10px] w-[90px] h-[30px] inline-block">
          <NuxtLink to="login" class="text-[20px] text-white text-center ml-[24%]">login</NuxtLink>
          </div>
        </div>
    </div>
    <!--Only for small screens-->
    <div v-if="isMenuVisible" class="bg-blue-600 bg-opacity-20 z-10 p-4 backdrop-blur-lg fixed w-1/2 h-screen flex flex-col top-0 left-0 bg-cover">
      <div><p class="text-white text-[40px] ml-[10px] cursor-pointer" @click="touchevent">≡</p></div>
      <NuxtLink to="/" class="ml-2 text-white text-base m-0.5">🏠Home</NuxtLink><br>
      <NuxtLink to="BookReader" class="ml-2 text-white text-base m-o.5">📚BookReader</NuxtLink><br>      
      <NuxtLink to="videoplayer" class="ml-2 text-white text-base m-0.5">💿Videoplayer</NuxtLink><br>
      <NuxtLink to="CDplayer" class="ml-2 text-white text-base m-0.5">🎶CDplayer</NuxtLink><br>
      <NuxtLink to="ReaderCollect" class="ml-2 text-white text-base m-0.5">💾ReaderCollect</NuxtLink><br>
      <NuxtLink to="history" class="ml-2 text-white text-base m-0.5">⏱History</NuxtLink>
      <NuxtLink to="register" class="text-[20px] text-white font-bold text-center ml-[15px] mt-[60px] border-[2px] rounded-[10px] m-0.5">register</NuxtLink>
      <NuxtLink to="login" class="text-[20px] text-white font-bold text-center ml-[15px] mt-[20px] border-[2px] rounded-[10px] m-0.5">login</NuxtLink>
    </div>
    
</template>
<script setup>
const isMenuVisible = ref(false);
const touchevent = () => {
  isMenuVisible.value = !isMenuVisible.value;
};
</script>