<template>
    <form class="flex flex-col  lg:grid lg:grid-cols-2 lg:gap-2 lg:items-start text-center p-8 " name="loginlist">
        <!--user name-->
        <p class=" flex justify-start text-white">User Name:</p>
        <input type="text" placeholder="User Name" class="ml-[0.1em]" v-model="username">

        <!--email-->
        <p class=" flex justify-start text-white">Email:</p>
        <input type="email" placeholder="Email" class="ml-[0.1em]" v-model="email">

        <!--phone number-->
        <p class=" flex justify-start text-white">Phone Number:</p>
        <input type="tel" ref="phoneInput" placeholder="Phone Number" class="ml-[0.1em]" v-model="phonenum" maxlength="11">

        <!--password-->
        <p class=" flex justify-start text-white">Password:</p>
        <div class=" relative flex justify-end ">
            <input :type="showPassword ? 'text' : 'password'" placeholder="Password" class="ml-[0.1em] w-full" v-model="password" ref="show1">
            <button class=" bg-white relative" @click="displayeye"> 
                <img src="./svg/svgviewer-output.svg" class=" block" ref="openeye"> 
                <img src="./svg/svgviewer-output (1).svg" class=" hidden" ref="closedeye">
            </button>
        </div>
        <p class=" flex justify-start text-white">Rewrite Password:</p>
        <div class=" relative flex justify-end ">
            <input :type="showPassword2 ? 'text' : 'password'" placeholder="Rewrite Password" class="ml-[0.1em] w-full" v-model="repassword">
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
useHead({
    link: [
        {   
            rel:"stylesheet",
            type: "text/css",
            href: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css"
        }
    ],
    script: [
        {
            type: "text/javascript",
            src: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"
        }
    ]
})
import { ref, onMounted } from 'vue';

const phoneInput = ref(null);
const username=ref("");
const email=ref("");
const phonenum=ref("");
const password=ref("");
const showPassword = ref(false);
const openeye=ref(null);
const closedeye=ref(null);
const repassword=ref("");
const show1=ref();
const showPassword2=ref(false);
const repasseye=ref(null);
const reclosed=ref(null);

onMounted(() => {
   window.intlTelInput(phoneInput.value, {
    utilsScript:
      'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
  });
});

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
    if (!validatePhone(phonenumval)||phonenumval.length<4 || phonenumval.length>11 ) {
        alert('请输入有效的电话号码');
        return false;
    }
    if (password !== confirmPassword) {
        alert('The two input secrets do not agree!');
        return false;
    };

    function validateEmail(email) {
        var emailRegex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        return emailRegex.test(email);
    };
    function validatePhone(phone) {
        var phoneRegex = /^\d{4,11}$/;
        return phoneRegex.test(phone);
    }

};

function displayeye(){
    showPassword.value = !showPassword.value;
    if (showPassword.value) {
        openeye.value.classList.remove('hidden');
        closedeye.value.classList.add('hidden');
    } else {
        openeye.value.classList.add('hidden');
        closedeye.value.classList.remove('hidden');
    }
}
function displayrepas(){
    showPassword2.value = !showPassword2.value;
    if (showPassword2.value) {
        repasseye.value.classList.remove('hidden');
        reclosed.value.classList.add('hidden');
    } else {
        repasseye.value.classList.add('hidden');
        reclosed.value.classList.remove('hidden');
    }
}
</script>
