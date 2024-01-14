<template>
    <!--password-->
    <p class=" flex justify-start ">Password:</p>
        <div >
            <input :type="showPassword ? 'text' : 'password'" placeholder="Password" class="ml-[0.1em] " v-model="password" ref="show1">
            <button type="button" class="  relative" @click="displayeye"> 
                <img src="D:\document file\JavaScript\JavaScrpit\vuep01\MikeReader\components\svg\svgviewer-output.svg" class=" block" ref="openeye"> 
                <img src="D:\document file\JavaScript\JavaScrpit\vuep01\MikeReader\components\svg\svgviewer-output (1).svg" class=" hidden" ref="closedeye">
            </button>
        </div>
        <p class=" flex justify-start ">Rewrite Password:</p>
        <div >
            <input :type="showPassword2 ? 'text' : 'password'" placeholder="Rewrite Password" class="ml-[0.1em]" v-model="repassword">
            <button type="button" class="  relative" @click="displayrepas">
                <img src="D:\document file\JavaScript\JavaScrpit\vuep01\MikeReader\components\svg\svgviewer-output.svg" class=" block" ref="repasseye"> 
                <img src="D:\document file\JavaScript\JavaScrpit\vuep01\MikeReader\components\svg\svgviewer-output (1).svg" class=" hidden" ref="reclosed">
            </button>   
        </div>
</template>
<script setup>
    import { ref } from 'vue';
    const password=ref("");
    const showPassword = ref(false);
    const openeye=ref(null);
    const closedeye=ref(null);
    const repassword=ref("");
    const show1=ref();
    const showPassword2=ref(false);
    const repasseye=ref(null);
    const reclosed=ref(null);

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