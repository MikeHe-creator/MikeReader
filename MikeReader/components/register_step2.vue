<template>
  <div v-if="showComponent2">
    <div class="mt-4">
      <p class="lg:max-w-[40ch] max-w-[26ch] ml-[0.5em] text-white">The verification code has been sent to your email. Please complete the email verification after receiving the verification code.</p>
    </div>

    <div class=" mt-[0.8em]">
      <input type="text" v-model="verificationCode" :class="{ ' bg-gray-200': completevc }" :disabled="completevc" class="ml-[0.5em] rounded-l-[10px] max-w-[8.6em]">
      <button @click="verifyCode" class="bg-blue-400 rounded-r-[10px] w-[6em]">{{ completevc ? '✔' : 'Submit' }}</button>
    </div>
  </div>
  <div class="flex items-center justify-between">
    <div class="text-white cursor-pointer inline-block">&lt;&lt;PREVIOUS</div>
    <div class="flex-grow"></div>
    <div class="text-white cursor-pointer inline-block" @click="componentsnext">NEXT&gt;&gt;</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const verificationCode = ref('');
const showComponent2 = ref(true);
const receivedVerificationCode = ref('');
const completevc = ref(false);
import axios from 'axios';

axios.post('http://38.242.159.56:5000/send_verification_code', { email: 'mikereader.register.en01@mikelearner.com' })
  .then(response => {
    receivedVerificationCode.value = response.data.code;
  })
  .catch(error => {
    console.error('Error receiving verification code:', error);
    alert("Failed to receive verification code. Please try again later.");
  });

function verifyCode() {
    if (verificationCode.value === receivedVerificationCode.value) {
        completevc.value = true;
    } else {
        alert("Please check your email for the verification code to try again.");
    }
}

function componentsnext(){
  if (completevc.value) {
    showComponent2.value = false;
  } else {
    alert("You haven't finished verifying your email!");
  }
}
</script>