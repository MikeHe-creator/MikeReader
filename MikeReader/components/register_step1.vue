<template>
                    <form class="flex flex-col  lg:grid lg:grid-cols-2 lg:gap-2 lg:items-start text-center p-8 " name="loginlist">
                    <p class=" flex justify-start text-white">User Name:</p>
                    <input type="text" placeholder="User Name" class="ml-[0.1em]" v-model="username">
                    <p class=" flex justify-start text-white">Email:</p>
                    <input type="email" placeholder="Email" class="ml-[0.1em]" v-model="email">
                    <p class=" flex justify-start text-white">Phone Number:</p>
                    <input type="tel" placeholder="Phone Number" class="ml-[0.1em]" v-model="phonenum">
                    <p class=" flex justify-start text-white">Password:</p>
                    <div class=" relative flex justify-end ">
                        <input type="password" placeholder="Password" class="ml-[0.1em] w-full" v-model="password">
                        <button class=" bg-white relative" @click="displayeye">
                            <img src="./svg/svgviewer-output.svg" class=" block" ref="openeye"> 
                            <img src="./svg/svgviewer-output (1).svg" class=" hidden" ref="closedeye">
                        </button>
                    </div>
                    <p class=" flex justify-start text-white">Rewrite Password:</p>
                    <div class=" relative flex justify-end ">
                        <input type="password" placeholder="Rewrite Password" class="ml-[0.1em] w-full" v-model="repassword">
                        <button class=" bg-white relative" @click="displayrepas">
                            <img src="./svg/svgviewer-output.svg" class=" block" ref="repasseye"> 
                            <img src="./svg/svgviewer-output (1).svg" class=" hidden" ref="reclosed">
                        </button>   
                    </div>
                    
                </form>
                <div>
                   <p class="ml-[2em] lg:max-w-[40ch] max-w-[26ch] whitespace-pre-wrap text-white"><input type="checkbox">I agree with our terms and conditions and privacy policy.</p> 
                </div>
                <div class="flex justify-center">
                    <div class="ml-[0.8em]">
                        <div class="bg-black border-[0.05em] inline-block min-w-[6em]"></div>
                        <div class="inline-block ml-[0.05em]"> OR </div>
                        <div class="bg-black border-[0.05em] inline-block min-w-[6em] ml-1"></div>
                    </div>
                </div>
                <div class="flex justify-center items-center">
                    <img src="./svg/icons8-google.svg">
                    <img src="./svg/icons8-microsoft.svg">
                    <img src="./svg/icons8-facebook.svg">
                    <img src="./svg/icons8-baidu.svg">
                    <img src="./svg/tencent-qq-logo-15957.svg">
                    <img src="./svg/icons8-wechat.svg">
                </div>
                <div class=" flex justify-end text-white cursor-pointer" @click="validateForm"> NEXT STEP>></div>
</template>
<script setup>
import { ref } from "vue";
const username=ref("");
const email=ref("");
const phonenum=ref("");
const password=ref("");
const repassword=ref("");
const repasseye = ref(null);
const reclosed = ref(null);
const openeye = ref(null);
const closedeye = ref(null);

function validateForm(){
    if (username.value=== "" || email.value === "" || phonenum.value === "" || password.value === "" || repassword.value === "") {
        alert('Please write all blanks!');
        return false;
    };
    var emailvalue=email.value;
    if (!validateEmail(emailvalue)) {
        alert('Please input the correct email adress!');
        return false;
    };
    var phonenumval=phonenum.value
    if (!validatePhone(phonenumval)) {
        alert('Please input the correct phone number!');
        return false;
    };
    if (password !== confirmPassword) {
        alert('The two input secrets do not agree!');
        return false;
    };

    function validateEmail(email) {
        var emailRegex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        return emailRegex.test(email);
    };
    function validatePhone(phonenum) {
        var phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phonenum);
    };
};

function displayeye() {
  openeye.value.classList.toggle("hidden");
  closedeye.value.classList.toggle("hidden");
}

function displayrepas() {
  repasseye.value.classList.toggle("hidden");
  reclosed.value.classList.toggle("hidden");
}
</script>