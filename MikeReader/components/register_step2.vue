<template>
  <div v-if="showComponent2">
    <div class="mt-4">
      <p class="lg:max-w-[40ch] max-w-[26ch] ml-[0.5em] text-white">The verification code has been sent to your email. Please complete the email verification after receiving the verification code.</p>
    </div>

    <div class=" mt-[0.8em]">
      <input type="text" v-model="verificationCode" class="ml-[0.5em] rounded-l-[10px] max-w-[8.6em]">
      <input type="submit" @click="verifyCode" class="bg-blue-400 rounded-r-[10px] w-[6em]">
    </div>
    <div class="flex items-center justify-between">
      <div class="text-white cursor-pointer inline-block">&lt;&lt;PREVIOUS</div>
      <div class="flex-grow"></div>
      <div class="text-white cursor-pointer inline-block">NEXT&gt;&gt;</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const verificationCode = ref('');   
const verificationError = ref('');
const showComponent2 = ref(true);
const receivedVerificationCode = ref(''); // 创建变量用于接收从服务器传来的验证码
import axios from 'axios';

// 使用axios从服务器端获取验证码
axios.post('http://38.242.159.56:5000/send_verification_code', { email: 'mikereader.register.en01@mikelearner.com' })
  .then(response => {
    // 从响应中获取验证码并赋值给receivedVerificationCode
    receivedVerificationCode.value = response.data.code;
    console.log('Received Verification Code:', receivedVerificationCode.value);
  })
  .catch(error => {
    console.error('Error receiving verification code:', error);
    alert("Failed to receive verification code. Please try again later.");
  });

function verifyCode() {
    // 检查用户输入的验证码是否与接收到的验证码匹配
    if (verificationCode.value === receivedVerificationCode.value) {
        // 如果匹配，显示"Verification successful"
        alert("Verification successful");
    } else {
        // 如果不匹配，显示提示信息
        alert("Please check your email for the verification code or try again.");
    }
}
</script>