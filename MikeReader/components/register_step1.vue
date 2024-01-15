<template>
    <form class="flex flex-col  lg:grid lg:grid-cols-2 lg:gap-2 lg:items-start text-center p-8 " name="loginlist">
        <!--user name-->
        <label class=" flex justify-start text-white">User Name:</label>
        <input type="text" placeholder="User Name" class="ml-[0.1em]" v-model="username">

        <!--email-->
        <label class=" flex justify-start text-white">Email:</label>
        <input type="email" placeholder="Email" class="ml-[0.1em]" v-model="email">

        <!--phone number-->
        <label class=" flex justify-start text-white">Phone Number:</label>
        <input type="tel" ref="phoneInput" placeholder="Phone Number" class="ml-[0.1em]" v-model="phonenum" maxlength="11">

        <!--password-->
        <label class=" flex justify-start text-white ">Password:</label>
        <div class=" relative flex justify-end ">
            <input :type="showPassword ? 'text' : 'password'" placeholder="Password" class="ml-[0.1em] w-full" v-model="password">
            <button type="button" class=" bg-white relative" @click="displayeye"> 
                <img v-if="showPassword" src="./svg/svgviewer-output (1).svg" alt="Password Hidden">
                <img v-else src="./svg/svgviewer-output.svg" alt="Password Visible">
            </button>
        </div>
        <label class=" flex justify-start text-white ">Rewrite Password:</label>
        <div class=" relative flex justify-end ">
            <input :type="showPassword2 ? 'text' : 'password'" placeholder="Rewrite Password" class="ml-[0.1em] w-full" v-model="repassword">
            <button type="button" class=" bg-white relative" @click="displayrepas"> 
                <img v-if="showPassword2" src="./svg/svgviewer-output (1).svg" alt="Password Hidden">
                <img v-else src="./svg/svgviewer-output.svg" alt="Password Visible">
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
const repassword=ref("");
const showPassword2=ref(false);


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
        alert('Please enter correct phone number!');
        return false;
    }

    function validateEmail(email) {
        var emailRegex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        return emailRegex.test(email);
    };
    function validatePhone(phone) {
        var phoneRegex = /^\d{4,11}$/;
        return phoneRegex.test(phone);
    }

};

function displayeye() {
  showPassword.value = !showPassword.value;
}
function displayrepas(){
  showPassword2.value = !showPassword2.value;
}
</script>
