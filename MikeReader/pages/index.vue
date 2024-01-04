<template>
   <div class=" bg-gradient-to-r to-gray-800 from-blue-800 relative w-[100%] h-[100%] top-0 left-0 bg-cover min-h-screen">
      <Headline></Headline>
      <div>
         <h1 class=" lg:text-[70px] text-[30px] font-bold mt-8 text-center text-gray-300">Welcome to MikeReader</h1>
      </div>
      <div>
        <span>
            <img alt="Books on the desks" src="./icons/Ali_Dream_books_desk_3D_icon_0_6f507acb-3f8b-45da-9d0f-9d671cda3918 (1).png" class="w-[650px] lg:ml-[200px] lg:mt-[50px]"> 
        </span>
        <span class=" absolute cursor-pointer lg:ml-[900px] lg:-mt-[540px] ml-[40px]">
            <button class=" justify-center bg-amber-600 text-[25px] lg:text-[40px] m-0.25 rounded-[10px] text-center w-[300px] lg:w-[500px] flex" @click="local">
                <p>📁Local Resource</p></button><br>
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
    <!--local popup-->
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-blue-600 bg-opacity-20 p-4 backdrop-blur-lg w-[470px] h-[300px] hidden" ref="localpop">
      <input type="file" class=" ml-[140px] mt-[70px] m-2">
      <p><span class="text-slate-200 ml-[140px] m-2">Type file:</span><span class="text-slate-200"> .unknown</span></p>
     <button class="mb-1 ml-[60px] m-2 bg-blue-600 mt-[40px] rounded-[10px] w-[90px]">Confirm</button>
     <button class=" mb-1 ml-[110px] m-2 bg-gray-50 rounded-[10px] w-[90px]" @click="hiddenpop">Cancel</button>
   </div>
   </div>
</template> 

<script setup>
import { ref } from "vue"
const localpop =ref();
function local(){
   localpop.value.style.display="block";
}

function hiddenpop(){
   localpop.value.style.display="none";
}
</script>