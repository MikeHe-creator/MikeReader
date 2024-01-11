<template>
    <div class="relative min-h-screen">
        <img src="./icons/Ali_Dream_cartoon_books_in_desk_cute.png" class="object-cover w-full h-full absolute top-0 left-0 z-[-20]">
    </div>
    <div class="absolute inset-0">
        <NuxtLink to="/" class=" absolute top-0 left-0"><p class=" text-white text-[1.2em] font-bold">&lt;&lt;BACK</p></NuxtLink>      
        <div class=" flex flex-col justify-center items-center min-h-screen">
            <div class=" bg-white bg-opacity-5 backdrop-blur-[10px] z-3 ">
                <form class="flex flex-col  lg:grid-flex-row items-start text-center p-8 " name="loginlist">
                    <p>User Name:</p>
                    <input type="text" placeholder="User Name" class="ml-[0.1em]">
                    <p>Email:</p>
                    <input type="email" placeholder="Email" class="ml-[0.1em]">
                    <p>Phone Number:</p>
                    <input type="tel" placeholder="Phone Number" class="ml-[0.1em]">
                    <p>Password:</p>
                    <input type="password" placeholder="Password" class="ml-[0.1em]">
                    <p>Rewrite Password:</p>
                    <input type="password" placeholder="Rewrite Password" class="ml-[0.1em]">
                </form>
                <p class=" min-w-[10px] whitespace-pre-wrap text-white">By creating an account, you agree to our terms and conditions and privacy policy.</p>
                <div class=" ml-[0.8em]">
                    <div class=" bg-black border-[0.05em] inline-block min-w-[6em] "></div>
                    <div class=" inline-block ml-[0.05em]"> OR </div>
                    <div class=" bg-black border-[0.05em] inline-block min-w-[6em] ml-1"></div>
                </div>
                <div class="flex justify-center items-center">
                    <img src="./icons/svg/icons8-google.svg">
                    <img src="./icons/svg/icons8-microsoft.svg">
                    <img src="./icons/svg/icons8-facebook.svg">
                    <img src="./icons/svg/icons8-baidu.svg">
                    <img src="./icons/svg/tencent-qq-logo-15957.svg">
                    <img src="./icons/svg/icons8-wechat.svg">
                </div>
                <div class=" flex justify-end text-white"> NEXT STEP>></div>
            </div>
            
        </div>
    </div>        
</template>  