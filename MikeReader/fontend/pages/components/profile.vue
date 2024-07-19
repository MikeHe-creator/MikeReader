<template>
  <div class="ml-[550px] mt-[-400px] w-[700px] h-[400px] bg-cyan-500 rounded-[20px] card" :class="{ flipped: isFlipped }">
    <!--卡的正面-->
    <Cardfront :isFlipped="isFlipped" :flipCard="flipCard" />

    <!--卡的背面-->
    <cardback :isFlipped="isFlipped" :flipCard="flipCard"/>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.5s;
  transform-style: preserve-3d;
  perspective: 500px;
}

.flipped {
  transform: rotateY(180deg);
}
</style>

<script setup>
import { ref } from 'vue';
import Cardfront from "~/pages/components/cardfront.vue";
import Cardback from "~/pages/components/cardback.vue";

const isFlipped = ref(false);
const flipCard = () => {
  isFlipped.value = !isFlipped.value;
};
</script>
