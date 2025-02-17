"use client"
import '../globals.css';
import Link from "next/link";
import React, {useEffect, useState} from "react";
import VideoOprate from "./components/videoOprate";
import ProfileLogin from "@/app/components/ProfileLogin";

export default function Video() {
    const [displayNow,setDisplayNow]=useState(true);
    const [videoName,setVideoName]=useState(null);
    const [totalDuration, setTotalDuration] = useState("00:00");
    const [videosrc, setVideosrc] = useState(null);
    const [videoFiles, setVideoFiles] = useState([]);
    const [isfullscreen, setIsfullscreen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        Vlist(videoFiles);
    }, [videoFiles]);

    function videoInput() {
        const videoold=document.getElementById("targetVideo")
        if(videoold && videoold.play()) videoold.pause();
        const play_pause=document.querySelector("img[alt='play/pause']");
        if(play_pause) play_pause.src="/ico/play.svg";

        const newVideoInput = document.createElement('input');
        newVideoInput.type = 'file';
        newVideoInput.accept = ".mp4, .avi, .mkv, .mov, .wmv, .flv, .webm, .ogv";
        newVideoInput.onchange = () => {
            const gotfs = newVideoInput.files[0];
            setVideoFiles(prevFiles => [...prevFiles, gotfs]);
            Vlist(videoFiles);
            return videoFiles;
        };
        newVideoInput.click();
    }

    function Vlist(videoFiles){
        console.log("videoFiles",videoFiles);
        const bofList = document.getElementById("bofList");
        bofList.innerHTML = "";
        Array.from(videoFiles).forEach(video=>{
            const videoName=video.name;
            const listItem = document.createElement("div");
            listItem.textContent = `${videoName}`;
            listItem.addEventListener("click", () => {VElementClicked(videoName)});
            bofList.appendChild(listItem);
            setVideoName(videoName);
            setVideosrc(makeVsrc(video))
        })
    }

    function makeVsrc(video){
        const targetVideo=document.getElementById("targetVideo");
        const blobURL = URL.createObjectURL(video);
        targetVideo.style.zIndex="10";
        getVideoDuration(video).then(duration => {
            const formattedDuration = formatDuration(duration);
            console.log("formattedDuration",formattedDuration);
            setTotalDuration(formattedDuration)
        }).catch(error => {
            console.error("获取视频时长失败:", error);
        });
        return blobURL;
    }

    function formatDuration(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const pad = (num) => num < 10 ? `0${num}` : num;
        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        } else {
            return `${pad(minutes)}:${pad(seconds)}`;
        }
    }

    function getVideoDuration(file) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            video.onerror = () => {
                reject(new Error("无法加载视频文件"));
            };
        })
    }

    function VElementClicked(videoName){
        const video = videoFiles.find(video => video.name === videoName);
        const playPauseIco = document.querySelector('img[alt="play/pause"]');
        playPauseIco.src="/ico/play.svg";
        setVideoName(videoName);
        setVideosrc(makeVsrc(video))
    }

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsfullscreen(false);
            } else {
                setIsfullscreen(true);
            }
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    function UsersIn(){
        setShowProfile((prev) => !prev);
    }

    return (
        <>
            <div className={"bg-gray-600 w-screen h-screen absolute -z-30"}/>
            <div className={"absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none z-0"} style={{backgroundImage: "url('/chahua/film_reel.png')"}}></div>
            <div className={`pl-6 max-w-[320px] ${displayNow ? '' : 'bg-black'}`} onClick={() => setDisplayNow(!displayNow)}>
                <button>
                    <object data={"/ico/Identical_to_mathematical_symbol.svg"} className={`objsvg w-10 h-10 block pointer-events-none invert`} id={'vn1'}></object>
                </button>
            </div>
            <div className={`flex-col pl-6 ${displayNow ? 'hidden' : 'flex'} justify-center text-[20px] w-[320px] bg-black h-[95vh] absolute z-20`}>
                <span className={"text-white"}><Link href={"/"}>Home</Link></span>
                <span className={"text-white"}><Link href={"/Book"}>Book</Link></span>
                <span className={"text-white"}><Link href={"/Music"}>Music</Link></span>
                {/*<span className={"text-white"}><Link href={"/Collection"}>Collection</Link></span>*/}
                <div className={"absolute z-5 bottom-2 flex flex-row"}>
                    <div>
                        <img src={"/ico/profile.svg"} alt={"用户中心"} className={"w-12 h-12 cursor-pointer bg-white rounded-full"} onClick={UsersIn}/>
                    </div>
                    <div className={"text-white flex flex-col"}></div>
                </div>
            </div>
            <div>
                <p className={"font-bold pl-10 text-1xl pt-2 text-white"}><span>Watching:</span><span id={'vcname'}> {videoName}</span></p>
            </div>
            <div className={"flex flex-col lg:justify-center lg:items-center items-start w-full h-full"}>
                <div className="relative w-full h-full flex flex-col lg:justify-center lg:items-center" id={'videoContainer'}>
                    <video className={`bg-black ${isfullscreen? "w-full h-full":"lg:w-[80vw] w-full lg:h-[60vh] h-[30vh]"}`} src={videosrc} id="targetVideo"></video>
                    <div className={`${isfullscreen? "w-full":"lg:w-[80vw] w-full"} z-10 absolute bottom-0`}>
                        <div className={"absolute b-[10%] left-[50%] translate-x-[-50%] bg-black transparent"}>
                            <div className={"text-[24px] text-white"} id={"subtitle"}></div>
                        </div>
                        <div className="opacity-0 hover:opacity-100 translate-y-2 hover:translate-y-0 transition-all duration-300 h-[5vh] bg-gradient-to-t from-gray-500 to-transparent">
                            <VideoOprate totalDuration={totalDuration} videosrc={videosrc} onVideoElementClicked={VElementClicked}/>
                        </div>
                    </div>
                </div>
                <div className={"lg:w-[80vw] w-full lg:h-[24vh] h-[40vh] flex flex-col bg-gray-500 mt-4"}>
                    <div className={"flex flex-col justify-center items-center w-full mt-2"}>
                        <p><span className={"text-blue-800 cursor-pointer"} onClick={videoInput}>Click here</span> to get the video file</p>
                        <div id={"bofList"} className={"flex flex-col items-start cursor-pointer pl-4 sm:pl-0 overflow-auto"}></div>
                    </div>
                </div>
            </div>
            <div className={`fixed inset-0 justify-center items-center h-screen z-[10] ${showProfile? "flex":"hidden"}`}>
                <ProfileLogin></ProfileLogin>
            </div>
        </>
    )
}