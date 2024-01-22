<template>
  <div>
    <div class="mt-[0.5em]">
      <p class="lg:max-w-[40ch] max-w-[26ch] ml-[0.5em] text-white">Choose a way to verify the authenticity of your information:</p>
      <form>
        <p class="ml-[0.5em] text-white">
          <label for="emailOption"><input type="radio" name="verificationOption" v-model="yourchoose" value="Email (recommended)">Email (recommended)</label>
        </p>
        <p class="ml-[0.5em] text-white">
          <label for="phoneOption"><input type="radio" name="verificationOption" v-model="yourchoose" value="Phone Number">Phone Number</label>
        </p>
      </form>
      <button class="bg-blue-400 ml-[0.5em] rounded-[10px]" @click="clicked1">Send verification code</button>
    </div>

    <div v-if="yourchoose === 'Email (recommended)' && clickedE" class="mt-4">
      <p class="lg:max-w-[40ch] max-w-[26ch] ml-[0.5em] text-white">The verification code has been sent to your email. Please complete the email verification after receiving the verification code.</p>
    </div>

    <div v-else-if="yourchoose === 'Phone Number' && clickedP " class="mt-4">
      <p class="lg:max-w-[40ch] max-w-[26ch] ml-[0.5em] text-white">The verification code has been sent to your mobile phone. Please complete the mobile phone verification after receiving the verification code.</p>
    </div>
    <div class=" mt-[0.8em]">
      <input type="text" class="ml-[0.5em] rounded-l-[10px] max-w-[8.6em]"><input type="submit" value="Submission" class="bg-blue-400 rounded-r-[10px] w-[6em]">
    </div>
    <div class="flex items-center justify-between">
      <div class="text-white cursor-pointer inline-block">&lt;&lt;PREVIOUS</div>
      <div class="flex-grow"></div>
      <div class="text-white cursor-pointer inline-block">NEXT&gt;&gt;</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const yourchoose = ref('Email (recommended)');
const clickedE = ref(false);
const clickedP = ref(false);

const clicked1 = () => {
  if (yourchoose.value==='Email (recommended)'){
    clickedE.value = true;
    clickedP.value=false;
  }else if(yourchoose.value==="Phone Number"){
    clickedE.value = false;
    clickedP.value = true;
  }else{
    clickedE.value = false;
    clickedP.value = true;
  }
};
</script>

  