<template>
  <div id='cardback' :class="{ hidden: !isFlipped }" class="back">
    <p class="font-bold text-white text-[60px] opacity-20 relative z-[-20] ml-[320px]">MikeReader</p>
    <div class="ml-[30px] mt-[10px]">
      <img alt="user2" src="../Elements/user2.png" width="200" height="200">
    </div>
    <p class="font-bold mt-[-260px] ml-[300px] text-[25px]" id="member">Welcome New Friend!</p>
    <div class="ml-[300px] mt-[20px]">
      <form>
        <label>Name:</label><input type="text" class="ml-[35px] rounded-[5px]"><br>
        <label>Email:</label><input type="email" class="ml-[40px] rounded-[5px] mt-[5px]"><br>
        <label>Password:</label><input type="password" class="ml-[10px] rounded-[5px] mt-[5px]"><br>
        <label>Confirm:</label><input type="password" class="ml-[20px] rounded-[5px] mt-[5px]"><br>
        <div class="hidden"><label>checkcode:</label><input type="text" class="rounded-[5px] mt-[5px]"></div>
      </form>
      <button class="bg-blue-500 rounded-[5px] h-[25px] w-[150px] mt-[8px] ml-[60px] font-bold">Decide to Join in!</button>
      <div class="mt-[20px]">
        <div class="bg-black border-[2px] inline-block w-[120px]"></div>
        <div class="inline-block ml-[5px]"> OR </div>
        <div class="bg-black border-[2px] inline-block min-w-[120px] ml-1 "></div>
      </div>
      <div class="ml-[-140px] flex justify-center items-center">
        <img alt="google" src="../Elements/svg/icons8-google.svg">
        <img alt="facebook" src="../Elements/svg/icons8-facebook.svg">
        <img alt="microsoft" src="../Elements/svg/icons8-microsoft.svg">
        <img alt="Baidu" src="../Elements/svg/icons8-baidu.svg">
        <img alt="QQ" src="../Elements/svg/tencent-qq-logo-15957.svg">
        <img alt="wechat" src="../Elements/svg/icons8-wechat.svg">
      </div>
      <div class="font-bold flex justify-end mt-[50px] mr-[20px] cursor-pointer" @click="flipCard">Aleady has an account?>></div>
    </div>
  </div>
</template>
<style scoped>
.back {
  transform: rotateY(180deg);
}
</style>
<script setup>
const props = defineProps({
  isFlipped: Boolean,
  flipCard: Function
});

const flipCard = () => {
  props.flipCard();
};
</script>