<template>
    <div class="relative min-h-screen">
        <img src="./icons/Ali_Dream_opening_book_books_on_the_desk__3d_icon_without_backg_a3b97dd3-8bf0-4c84-9374-7f178617f41b.png" class="object-cover w-full h-full absolute top-0 left-0 z-[-20]">
    </div>
    <div class="absolute inset-0">
        <NuxtLink to="/" class=" absolute top-0 left-0"><p class=" text-white text-[1.2em] font-bold">&lt;&lt;BACK</p></NuxtLink>      
        <div class=" flex flex-col justify-center items-center min-h-screen">
            <div class=" bg-white bg-opacity-5 backdrop-blur-[10px] z-3 items-center win-w-[10em]">
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
                </div>
            </div> 
        </div>
    </div>        
</template>
<script setup>

</script>  