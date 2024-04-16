<template>
  <div id="cardfront" ref="cardfront" :class="{ hidden: isFlipped }">
    <p class="font-bold text-white text-[60px] opacity-20 relative z-[-20] ml-[320px]">MikeReader</p>
    <div class="ml-[30px] mt-[10px]">
      <img alt="user" src='../Elements/user.png' width="200" height="200">
    </div>
    <p class="font-bold mt-[-260px] ml-[300px] text-[25px]" id="member">Member Card</p>
    <div class="ml-[300px] mt-[40px]">
      <form>
        <label>Email:</label><input type="email" class="ml-[40px] rounded-[5px]" ref="email"><br>
        <label>Password:</label><input type="password" class="ml-[10px] rounded-[5px] mt-[5px]" ref="password">
      </form>
      <div class="mt-[40px]">
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
      <button class="w-[200px] h-[30px] bg-blue-500 rounded-[10px] ml-[25px] mt-[20px] font-bold" @click="wback">Welcome Back!</button>
      <div class="font-bold flex justify-end mt-[20px] mr-0 cursor-pointer" >Forgot Password>></div>
      <div class="font-bold flex justify-end cursor-pointer" @click="flipCard">A new member? Join Us!>></div>
    </div>
  </div>
</template>
<style scoped>
.hidden {
  display: none;
}
</style>
<script setup>
import {ref} from 'vue'
const props = defineProps({
  isFlipped: Boolean,
  flipCard: Function
});

const flipCard = () => {
  props.flipCard();
};

//用户登录
const email=ref()
const password=ref()
function wback() {
  //临时账户：
  if (email.value.value === 'hesiyang@1' && password.value.value==='hsy123'){
    const newAlt='超级用户';
    const newSrc='../Elements/yuuki.png'
  }
}

</script>