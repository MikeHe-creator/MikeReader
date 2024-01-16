<template>
  <!--password-->
  <label class="flex justify-start">Password:</label>
  <div class="relative flex">
    <input type="text" placeholder="Password" class="ml-[0.1em]" v-model="password" />
  </div>
  <label class="flex justify-start">Rewrite Password:</label>
  <div class="relative flex">
    <input type="text" placeholder="Rewrite Password" class="ml-[0.1em]" v-model="repassword" />
  </div>
  <div class="flex cursor-pointer" @click="validateForm"> NEXT STEP>></div>
</template>

<script setup>
import { ref } from 'vue';

const password = ref('');
const repassword = ref('');

function validateForm() {
  if (!validatePassword(password.value) || password.value.length < 6) {
    alert('请输入正确的密码，包括大写字母、小写字母、数字和有效字符。密码长度不得少于6个字符！');
  }else{
    alert("验证通过")
  };
  if (!validatePassword(repassword.value) || repassword.value.length < 6) {
    alert('请输入正确的密码，包括大写字母、小写字母、数字和有效字符。密码长度不得少于6个字符！');
  }else{
    alert("验证通过")
  };
}
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
}
</script>
