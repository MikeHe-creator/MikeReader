<template>
  <div class="relative h-screen overflow-hidden">
    <p class="text-gray-200 lg:text-[300px] text-[270px] ml-[450px] lg:mt-[400px] sm:mt-[300px] rotate-90 lg:rotate-0 -z-10 relative">Bookreader</p>
  </div>
  <div class="absolute inset-0">
    <div class=" bg-gradient-to-r to-orange-500 from-orange-200">
      <Headline/>
      <h1 class="ml-[0.5em] mt-[0.4em] text-[2em] bg-orange-500 max-w-[5.7em] text-center">Bookreader</h1>
    </div>
    <div class=" bg-orange-500 h-2 lg:h-3"></div>
    <pdfreader/>
  </div>
</template>
<script setup>

</script>