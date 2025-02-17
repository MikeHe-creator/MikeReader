"use client"
import '../globals.css';
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {CPInforList} from "./musicPlaySet"
import ProfileLogin from "@/app/components/ProfileLogin";

export default function Music() {
    const [cpcover,setCpcover]=useState("../chahua/enjoy_muisc.png");
    const [fanzYanse,setFanzYanse]=useState(false);
    const [displayNow,setDisplayNow]=useState(true);
    const [jintuChang,setjintuChang]=useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [bofang, setbofang] = useState("/ico/shuffle.svg");
    const [showProfile, setShowProfile] = useState(false);

    const BofList = ["/ico/shuffle.svg", "/ico/order-play.svg", "/ico/single-loop.svg", "/ico/list-loop.svg"];
    const qiehuangBof = () => {
        const nextIndex = (currentIndex + 1) % BofList.length;
        setbofang(BofList[nextIndex]);
        setCurrentIndex(nextIndex);
    };
    const togglePlayPause = () => {
        console.log("togglePlayPause",isPlaying);
        setIsPlaying(isPlaying);
    };


    useEffect(() => {
        let touchStartX = 0;
        let touchMoveX = 0;
        let isSwipe = false;
        const zhishi1 = document.getElementById("zhishi1");
        const zhishi2 = document.getElementById("zhishi2");
        const cpfengM = document.getElementById("cpfengM");
        const gedan=document.getElementById("gedan");
        const geci=document.getElementById("geci");

        const GeciAndFengm = (HuadongD) => {
            if (HuadongD === "right") {
                zhishi1.style.width = "0.5rem";
                zhishi1.style.borderColor = "rgb(249 250 251 / var(--tw-border-opacity))";
                zhishi2.style.width = "1.25rem";
                zhishi2.style.borderColor = "rgb(107 114 128 / var(--tw-border-opacity))";
                cpfengM.style.display = "none";
                geci.style.display = "none";
                gedan.style.display = "flex";
            } else {
                zhishi1.style.width = "1.25rem";
                zhishi1.style.borderColor = "rgb(107 114 128 / var(--tw-border-opacity))";
                zhishi2.style.width = "0.5rem";
                zhishi2.style.borderColor = "rgb(249 250 251 / var(--tw-border-opacity))";
                cpfengM.style.display = "flex";
                geci.style.display = "flex";
                gedan.style.display = "none";
            }
        };

        let doubleClick = false;

        const handleClick = (e) => {
            const cpfengM = document.getElementById("cpfengM");
            const geciDIV2 = document.getElementById("geciDIV2");
            if (
                e.target.tagName.toLowerCase() === "div" &&
                e.target.closest("#geci") &&
                window.innerWidth < 768 &&
                cpfengM &&
                geciDIV2
            ) {
                const isHidden = cpfengM.style.display === "none";
                if (isHidden) {
                    cpfengM.style.display = "flex";
                    geciDIV2.style.height = "calc(35vh - 100px)";
                } else {
                    cpfengM.style.display = "none";
                    geciDIV2.style.height = "calc(35vh + 240px)";
                }
                doubleClick = !doubleClick;
                console.log("Double Click:", doubleClick);
                console.log("cpfengM Display:", cpfengM.style.display);
                console.log("geciDIV2 Height:", geciDIV2.style.height);
            }
        };

        window.addEventListener("click", handleClick);

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
            isSwipe = true;
        };
        const handleTouchMove = (e) => {
            if (!isSwipe) return;
            touchMoveX = e.touches[0].clientX;
            const dist = touchMoveX - touchStartX;
            if (dist < 0 && window.innerWidth < 768) {
                GeciAndFengm("right");
            } else if(dist > 0 && window.innerWidth < 768){
                GeciAndFengm("left")
            }
            touchStartX = touchMoveX;
        };

        const handleTouchEnd = () => {isSwipe = false;};
        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    useEffect(() => {
        const jump=document.getElementById("jump");
        const playerRQ=document.getElementById("playerRQ");
        const soundsBoard=document.getElementById("soundsBoard");
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = cpcover;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            const colorCount = {};
            let r,g,b
            for (let i = 0; i < data.length; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                const color = `${r},${g},${b}`;
                colorCount[color] = (colorCount[color] || 0) + 1;
            }

            let maxCount = 0;
            let dominantColor = "";
            for (const color in colorCount) {
                if (colorCount[color] > maxCount) {
                    maxCount = colorCount[color];
                    dominantColor = color;
                    jump.style.height="100%";
                }
            }
            const rgbColor = `rgb(${dominantColor})`;
            console.log("rgbColor:",rgbColor);
            playerRQ.style.backgroundColor = `${rgbColor}`;
            soundsBoard.style.backgroundColor = `${rgbColor}`;
            if(displayNow === false){
                jump.style.backgroundColor=`${rgbColor}`;
            } else {
                jump.style.backgroundColor='transparent';
                jump.style.height="auto";
            }
            const [rValue, gValue, bValue] = dominantColor.split(',').map(Number);
            if ((rValue < 50 && gValue < 50 && bValue > 100) || (rValue < 50 && gValue < 50 && bValue < 50)) {
                setFanzYanse(true);
            }else{
                setFanzYanse(false);
            }
        };
    }, [cpcover, displayNow]);

    const listXingxis= {}
    function addCp(){
        const aduioInput=document.createElement('input');
        aduioInput.type = "file";
        aduioInput.accept =".mp3, .wav, .flac, .aac, .ogg, .m4a, .wma, .aiff, .alac, .opus, .dsd";
        aduioInput.onchange =()=>{
            const gotfs = aduioInput.files[0];
            const musicF=gotfs.name;
            console.log(gotfs.name);
            musicJiexi(gotfs,musicF);
        }
        aduioInput.click();
    }

    function musicJiexi(gotfs,musicF){
        const musicPass = new FormData();
        musicPass.append("file", gotfs);
        fetch('http://localhost:8080/musicJiexi', {
            method: 'POST',
            body: musicPass
        })
            .then(response => response.json())
            .then(data => {
                console.log("data", data);
                if (!listXingxis[musicF]) {
                    listXingxis[musicF] = data;
                }
                console.log("listXingxis",listXingxis);
                CPInforList(listXingxis,setCpcover,setIsPlaying,setjintuChang);
            })
            .catch(err => console.log(err));
    }

    function UsersIn(){
        setShowProfile((prev) => !prev);
    }

    return (
        <>
            <div className={'w-screen h-screen absolute bg-cover bg-center opacity-25 z-[-30]'} style={{backgroundImage: `url('${cpcover}')`}}/>
            <div className={`absolute z-[8] lg:w-1/4 w-full h-full`} id={'jump'}>
                <div className={`pl-6 max-w-[320px] ${fanzYanse ? "invert" : "none"} `} onClick={() => setDisplayNow(!displayNow)}>
                    <button>
                        <object data={"/ico/Identical_to_mathematical_symbol.svg"} className={`w-10 h-10 block pointer-events-none ${fanzYanse ? "invert" : "none"}`} id={'vn1'}></object>
                    </button>
                </div>
                <div className={`flex-col pl-6 ${displayNow ? 'hidden' : 'flex'} justify-center text-[20px] h-[95vh]`}>
                    <span className={`${fanzYanse ? "text-white" : "text-black"}`}><Link href={"/"}>Home</Link></span>
                    <span className={`${fanzYanse ? "text-white" : "text-black"}`}><Link href={"/Book"}>Book</Link></span>
                    <span className={`${fanzYanse ? "text-white" : "text-black"}`}><Link href={"/Video"}>Video</Link></span>
                    {/*<span className={`${fanzYanse ? "text-white" : "text-black"}`}><Link href={"/Collection"}>Collection</Link></span>*/}
                    <div className={"absolute z-5 bottom-2 flex flex-row"}>
                        <div>
                            <img src={"/ico/profile.svg"} alt={"用户中心"} className={"w-12 h-12 cursor-pointer rounded-full"} onClick={UsersIn}/>
                        </div>
                        <div className={"text-white flex flex-col"}></div>
                    </div>
                </div>
            </div>

            <div className={"flex flex-col lg:flex-row pl-3 pt-12"}>
                <div className={"gedan lg:w-3/5 w-[90vw] h-[75vh] lg:h-[83vh] rounded-2xl lg:flex flex-col hidden"} style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}} id={"gedan"}>
                    <div className={"flex justify-center items-center"}>
                        <p><span className={"text-blue-500 cursor-pointer"} onClick={addCp}>Click here</span> to get the audio file</p>
                    </div>
                    <div id={"gd_content"} className={"h-[68vh] overflow-auto"}></div>
                </div>
                <div className={"flex flex-col lg:w-2/5 w-full mt-6 lg:mt-0"}>
                    <div className={"h-[40vh] flex justify-center items-center"} id={'cpfengM'}>
                        <img src={cpcover} alt={'唱片封面（默认）'} className="w-60 h-60"/>
                    </div>
                    <div className={"lg:h-[40vh] h-[30vh] flex justify-center  overflow-auto"} id={'geci'}>
                        <p className={`lg:hidden ${isPlaying? "hidden":"flex"}`}><span className={"text-blue-500 cursor-pointer"} onClick={addCp}>Click here</span> to get the audio file</p>
                    </div>
                </div>
            </div>

            <div className={"lg:hidden flex-row flex bottom-[15%] absolute justify-center w-screen"}>
                <div className={"border-4 w-5 h-2 border-solid border-gray-500 rounded-2xl"} id={"zhishi1"}></div>
                <div className={"border-4 w-2 h-2 border-solid border-gray-50 rounded-2xl ml-2"} id={"zhishi2"}></div>
            </div>

            <div className={"absolute bottom-0 w-screen h-24"} id={"playerRQ"}>
                <div className="absolute m-0 flex w-screen h-1 cursor-pointer" id={"sjzhou"}>
                    <div className="relative h-1 bg-blue-600 border-solid mb-2 rounded-2xl" style={{width: `${jintuChang}px`}}>
                        <div className="absolute w-3 h-3 bg-white rounded-full hover:w-4 hover:h-4 cursor-pointer" style={{top: "0%", left: `${jintuChang-1}px`, transform: "translate(-50%, -50%)"}}></div>
                    </div>
                </div>
                <div className={"lg:flex hidden"} id={'bofXxi'}>
                    <div className={"w-16 h-16 left-4 top-[1rem] absolute inline-flex"} id={'CPfengmian'}></div>
                    <div className={'flex-col lg:flex hidden'}>
                        <p className={"left-20 top-[1.4rem] absolute"}>
                            <span id={"musicName"} className={`ml-3 inline-flex ${fanzYanse ? "text-white" : "text-black"} max-w-[150px]`}></span>
                            <span id={"musicAuthor"} className={`ml-3 inline-flex ${fanzYanse ? "text-gray-500" : "text-gray-800"} max-w-[100px]`}></span>
                        </p>
                        <p className={`left-24 top-[3rem] absolute ${fanzYanse ? "text-white" : "text-black"}`} id={"musicTime"}></p>
                    </div>
                </div>

                <div className={"flex flex-row items-center justify-center mt-5"}>
                    <div className={"cursor-pointer"} onClick={qiehuangBof}>
                        <object data={bofang} className={`w-8 h-8 inline-flex ${fanzYanse ? "text-white" : "text-black"} ${fanzYanse ? "invert" : "none"} pointer-events-none`} id={"bofqieh"}></object>
                    </div>
                    <div className={"backforward"}>
                        <object data={"/ico/music-back.svg"} className={` w-8 h-8 inline-flex ml-3 cursor-pointer ${fanzYanse ? "invert" : "none"} pointer-events-none`}></object>
                    </div>
                    <div onClick={togglePlayPause} id={"playornotICO"}>
                        <object data={"/ico/play.svg"} className={`w-8 h-8 ${isPlaying ? 'hidden' : 'inline-flex'} ml-3 cursor-pointer ${fanzYanse ? "invert" : "none"} pointer-events-none`} id={'play'}></object>
                        <object data={"/ico/pause.svg"} className={`w-8 h-8 ${isPlaying ? 'inline-flex' : 'hidden'} ml-3 cursor-pointer ${fanzYanse ? "invert" : "none"} pointer-events-none`} id={'pause'}></object>
                    </div>
                    <div className={"backforward"}>
                        <object data={"/ico/fast-forward.svg"} className={`w-8 h-8 inline-flex ml-3 cursor-pointer ${fanzYanse ? "invert" : "none"} pointer-events-none`} ></object>
                    </div>
                    <div id={"soundCtrl"} className={"relative"}>
                        <object data={"/ico/sound.svg"} className={`w-8 h-8 inline-flex ml-3 cursor-pointer ${fanzYanse ? "invert" : "none"} pointer-events-none`}></object>
                    </div>
                    <div className="absolute top-[-0.5em] w-10 transform -translate-x-1/2 -translate-y-full flex-col items-center z-10 hidden" id="soundsBoard">
                        <span id="volumeValue" className={`${fanzYanse ? "text-white" : "text-black"}`}>100</span>
                        <div className={`relative w-1 h-20 ${fanzYanse ? "bg-white" : "bg-black"} border-solid mb-2 rounded-2xl`}>
                            <div id="volumeDot" className="absolute w-3 h-3 bg-white rounded-full cursor-pointer" style={{top: "0%", left: "50%", transform: "translate(-50%, -50%)"}}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`fixed inset-0 justify-center items-center h-screen z-[7] ${showProfile? "flex":"hidden"}`}>
                <ProfileLogin></ProfileLogin>
            </div>
        </>
    );
}