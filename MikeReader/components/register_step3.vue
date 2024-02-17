<template>
    <div class="flex flex-col items-center" v-if="showComponent3">
      <div>
        <img src="./svg/male-avatar-4942266-4116910.gif" height="300" width="200">
        <p>You are successfully registered! You can log in!</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const showComponent3 = ref(true);
  </script>