<template>
   <div class=" bg-gradient-to-r to-gray-800 from-blue-800 relative w-[100%] h-[100%] top-0 left-0 bg-cover min-h-screen">
      <div>
         <div class=" lg:hidden sm:block text-white text-[40px] ml-[10px]">≡</div>
      </div>
      <div class=" hidden lg:flex">
         <NuxtLink to="bookstores" class="ml-[10px] text-[20px] text-white">📚Bookstores</NuxtLink>
         <NuxtLink to="videoplayer" class="ml-[10px] text-[20px] text-white">💿Videoplayer</NuxtLink>
         <NuxtLink to="CDplayer" class="ml-[10px] text-[20px] text-white">🎶CDplayer</NuxtLink>
         <NuxtLink to="bookwebcollect" class="ml-[10px] text-[20px] text-white">💾BookWebCollect</NuxtLink>
         <NuxtLink to="history" class="ml-[10px] text-[20px] text-white">⏱History</NuxtLink>
      </div>
      <div>
         <h1 class=" lg:text-[70px] text-[30px] font-bold mt-8 text-center text-gray-300">Welcome to MikeReader</h1>
      </div>
      <div>
        <span>
            <img alt="Books on the desks" src="./icons/Ali_Dream_books_desk_3D_icon_0_6f507acb-3f8b-45da-9d0f-9d671cda3918 (1).png" class="w-[650px]"> 
        </span>
        <span class=" absolute cursor-pointer lg:ml-[900px] lg:-mt-[570px] ml-[40px]">
            <button class=" justify-center bg-amber-600 text-[25px] lg:text-[40px] m-0.25 rounded-[10px] text-center w-[300px] lg:w-[500px] flex"><p>📁Local Resource</p></button><br>
            <button class=" flex items-center justify-center bg-white text-[20px] lg:text-[40px] m-0.25 rounded-[10px] text-center w-[300px] lg:w-[500px]">
                <span class="inline-block"><img src="./icons/24eba9da-0a96-4b7d-934d-04550afba875.png"></span>
                <span class="inline-block"><P>Baidu Netdisk</P></span></button><br>
            <button class=" flex items-center justify-center bg-green-300 text-[20px] lg:text-[40px] m-0.25 rounded-[10px] text-center w-[300px] lg:w-[500px]" >
                <span class="inline-block top-4"><img src="./icons/svg/7123027_drive_google_icon.svg"></span>
                <span class="inline-block"><P>Google Drive</P></span></button><br>
            <button class="flex items-center justify-center bg-blue-600 text-[20px] lg:text-[40px] m-0.25 rounded-[10px] text-center w-[300px] lg:w-[500px]">
               <span class="inline-block"><img src="./icons/svg/6296668_microsoft_office_office365_onedrive_icon.svg" class="mr-2" /></span>
               <span class="inline-block"><p>Microsoft OneDrive</p></span></button>
        </span>
    </div>
   </div>

</template>  