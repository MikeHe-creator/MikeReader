<template>
<div :style="{ display: Shouldblock }">
    <form class="flex flex-col  lg:grid lg:grid-cols-2 lg:gap-2 lg:items-start text-center p-8 " name="loginlist">
        <!--user name-->
        <label class=" flex justify-start text-white">User Name:</label>
        <input type="text" placeholder="User Name" class="ml-[0.1em]" v-model="username">

        <!--email-->
        <label class=" flex justify-start text-white">Email:</label>
        <input type="email" placeholder="Email" class="ml-[0.1em]" v-model="email">

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
        <p class="ml-[2em] lg:max-w-[40ch] max-w-[26ch] whitespace-pre-wrap text-white"><input type="checkbox" v-model="agreeCheckbox">I agree with our terms and conditions and privacy policy.</p> 
    </div>
    <div class="flex justify-center">
        <div class="ml-[0.8em]">
            <div class="bg-black border-[0.05em] inline-block min-w-[6em]"></div>
            <div class="inline-block ml-[0.05em]"> OR </div>
            <div class="bg-black border-[0.05em] inline-block min-w-[6em] ml-1"></div>
        </div>
    </div>
    <BythirdPartyRegister></BythirdPartyRegister>
    <div class=" flex justify-end text-white cursor-pointer" @click="validateForm"> NEXT STEP>></div>
</div>
</template>
<script setup>
import { ref} from 'vue';
import axios from 'axios';

const { emit } = getCurrentInstance();

const username=ref("");
const email=ref("");
const password=ref("");
const showPassword = ref(false);
const repassword=ref("");
const showPassword2=ref(false); 
const agreeCheckbox=ref(false);
const Shouldblock = ref(' block'); 
let notalert=0;

async function validateForm() {
    if (username.value === "" || email.value === "" || password.value === "" || repassword.value === "") {
        alert('Please write all blanks!');
        return false;
    } else {
        notalert += 1;
    };

    var emailvalue = email.value;
    if (!validateEmail(emailvalue)) {
        alert('Please input the correct email address!');
        return false;
    } else {
        notalert += 1;
    };

    if (!validatePassword(password.value) && password.value.length < 6) {
        alert("Please enter the correct password, including uppercase and lowercase letters + numbers + valid characters. The password should not be less than 6 characters!");
    } else {
        notalert += 1;
    };

    if (!validatePassword(repassword.value) && repassword.value.length < 6 || password.value !== repassword.value) {
        alert("Please enter again the correct password, including uppercase and lowercase letters + numbers + valid characters. The password should not be less than 6 characters and the password and the rewritten password are same!");
    } else {
        notalert += 1;
    };

    if (!agreeCheckbox.value) {
        alert("If you want to register our web, please agree with our terms and conditions and privacy policy. ")
    } else {
        notalert += 1;
    }

    if (notalert === 5) {
        // Check if email is already registered
        try {
            const response = await axios.get(`http://38.242.159.56:5000/check_email/${email.value}`);
            if (response.data.exists) {
                alert('This email is already registered. Please use a different email.');
                return;
            } else {
                Shouldblock.value = "none";
                emit('step1Success');
                // Store user registration information
                const userdata = {
                    username: username.value,
                    email: email.value,
                    password: password.value
                };
                console.log(userdata);
                // Register the user
                await axios.post('http://38.242.159.56:5000/register', userdata);
                console.log("User registered successfully");
                // Send verification code
                const verificationResponse = await axios.post('http://38.242.159.56:5000/send_verification_code', { email: email.value });
                console.log("Verification code sent successfully");
                emit('verificationCodeSent', verificationResponse.data.code);
            }
        } catch (error) {
            console.error('Error registering user or sending verification code:', error);
            alert('An error occurred. Please try again later.');
        }
    };
};

function validateEmail(email) {
    var emailRegex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    return emailRegex.test(email);
};

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
};

function displayeye() {
    showPassword.value = !showPassword.value;
}

function displayrepas() {
    showPassword2.value = !showPassword2.value;
}

</script>
