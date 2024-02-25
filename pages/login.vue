<template>
    <div class="relative min-h-screen">
        <img src="./icons/Ali_Dream_cartoon_books_in_desk_cute_3d_0_1ab659ec-25fe-4e67-b6df-9043c1884f54.png" class="object-cover w-full h-full absolute top-0 left-0 z-[-20]">
    </div>
    <div class="absolute inset-0">
        <NuxtLink to="/" class=" absolute top-0 left-0"><p class=" text-white text-[1.2em] font-bold">&lt;&lt;BACK</p></NuxtLink>      
        <div class=" flex flex-col justify-center items-center min-h-screen">
            <div class=" bg-white bg-opacity-5 backdrop-blur-[10px] z-3 items-center win-w-[10em]">
                <from class="flex flex-col  lg:grid lg:grid-cols-2 lg:gap-2 lg:items-start text-center p-2" name="loginlist2">
                   <label class=" flex justify-start">Email:</label><input type="email">
                   <label class=" flex justify-start">Password:</label><input type="password">
                   <label class=" flex justify-start"><input type="checkbox">Stay signed</label><NuxtLink to="forgotpassword" class=" text-blue-300">Forgot Password? &gt;&gt;</NuxtLink>  
                </from>
                <button class=" bg-blue-500 rounded-[5px] text-white font-bold min-w-[10em] flex justify-center mx-auto">LOG IN</button>
                <div class="flex justify-center">
                    <div class="ml-[0.8em]">
                        <div class="bg-black border-[0.05em] inline-block min-w-[6em]"></div>
                        <div class="inline-block ml-[0.05em]"> OR </div>
                        <div class="bg-black border-[0.05em] inline-block min-w-[6em] ml-1"></div>
                    </div>
                </div>
                <div class="flex justify-center items-center">
                    <img src="./icons/svg/icons8-google.svg">
                    <img src="./icons/svg/icons8-microsoft.svg">
                    <img src="./icons/svg/icons8-facebook.svg">
                    <img src="./icons/svg/icons8-baidu.svg">
                    <img src="./icons/svg/tencent-qq-logo-15957.svg">
                    <img src="./icons/svg/icons8-wechat.svg">
                </div>
                <div class="text-white font-bold">New to MikeReader? <NuxtLink to="register" class="text-blue-800 font-bold">Create Account</NuxtLink></div> 
            </div>  
        </div>
    </div>        
</template>   