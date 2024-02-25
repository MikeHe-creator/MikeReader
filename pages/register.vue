<template>
  <div class="relative min-h-screen">
    <img src="./icons/Ali_Dream_cartoon_books_in_desk_cute.png" class="object-cover w-full h-full absolute top-0 left-0 z-[-20]">
  </div>
  <div class="absolute inset-0">
    <NuxtLink to="/" class=" absolute top-0 left-0"><p class=" text-white text-[1.2em] font-bold">&lt;&lt;BACK</p></NuxtLink>
    <div class=" flex flex-col justify-center items-center min-h-screen">
      <div class=" bg-white bg-opacity-5 backdrop-blur-[10px] z-3 items-center win-w-[10em]">
        <RegisterStep1 @step1Success="showStep2"></RegisterStep1>
        <RegisterStep2 v-if="showComponent2" @step2Success="showStep3"></RegisterStep2>
        <RegisterStep3 v-if="showComponent3" ></RegisterStep3>
        <div class=" text-white font-bold">Already have an account? <NuxtLink to="login" class=" text-blue-800 font-bold">Login</NuxtLink></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showComponent2 = ref(false);
const showComponent3 = ref(false);

function showStep2() {
  showComponent2.value = true;
}

function showStep3(){
  showComponent3.value=true;
}
</script>