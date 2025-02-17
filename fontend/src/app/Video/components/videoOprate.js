import React, {useEffect, useState} from 'react';

export default function VideoOprate({ totalDuration, videosrc, onVideoElementClicked}) {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState("00:00");
    const [isfullscreen, setIsfullscreen] = useState(false);

    useEffect(() => {
        const videoElement = document.querySelector("video");
        let intervalId = null;

        if (videoElement) {
            videoElement.src = videosrc;
            videoElement.load();
            const handlePlay = () => {
                setIsPlaying(true);
                startTimer(videoElement);
            };
            const handlePause = () => {
                setIsPlaying(false);
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            };
            videoElement.addEventListener("play", handlePlay);
            videoElement.addEventListener("pause", handlePause);

            return () => {
                videoElement.removeEventListener("play", handlePlay);
                videoElement.removeEventListener("pause", handlePause);
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };
        }

        function startTimer(videoElement) {
            const totalDurationInSeconds = parseTime(totalDuration);
            intervalId = setInterval(() => {
                if (!videoElement.paused) {
                    const currentTime = videoElement.currentTime;
                    const formattedTime = formatTime(currentTime);
                    setCurrentTime(formattedTime);
                    if (currentTime >= totalDurationInSeconds) {
                        setCurrentTime("00:00");
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                    timeLine(currentTime, totalDurationInSeconds);
                }
            }, 1000);
        }
    }, [videosrc, totalDuration]);

    function videoplay() {
        const videoElement = document.querySelector("video");
        const playPauseIco = document.querySelector('img[alt="play/pause"]');
        if (videoElement) {
            if (!videoElement.paused) {
                playPauseIco.src = "/ico/play.svg";
                videoElement.pause();
            } else {
                videoElement.play()
                    .then(() => {
                        playPauseIco.src = "/ico/pause.svg";
                    })
                    .catch(error => {
                        console.error("播放失败：", error);
                    });
            }
        }
    }

    function parseTime(timeString) {
        const parts = timeString.split(":");
        if (parts.length === 3) {
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            const seconds = parseInt(parts[2], 10);
            return hours * 3600 + minutes * 60 + seconds;
        } else if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            return minutes * 60 + seconds;
        }
        return 0;
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
        } else {
            return `${pad(minutes)}:${pad(secs)}`;
        }
        function pad(num) {
            return num < 10 ? `0${num}` : num;
        }
    }

    function timeLine(currentTimeInSeconds, totalDurationInSeconds) {
        //console.log("currentTimeInSeconds",currentTimeInSeconds);
        console.log("totalDurationInSeconds",totalDurationInSeconds);
        const totalLongElement = document.getElementById("totalLong");
        const TotalLongWidth = totalLongElement.offsetWidth;
        const progressWidth = (currentTimeInSeconds / totalDurationInSeconds) * TotalLongWidth;
        setProgress(progressWidth);

        totalLongElement.addEventListener('click',(e)=>{
            const rect = totalLongElement.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / TotalLongWidth) * totalDurationInSeconds;
            const targetVideo=document.getElementById("targetVideo");
            if (targetVideo) {
                targetVideo.currentTime = newTime;
                targetVideo.play();
                setIsPlaying(true);
            }
        })
    }

    function backForward(derection){
        const bofList = document.getElementById("bofList");
        const vcnameElement = document.getElementById("vcname");
        if (!vcnameElement) {
            console.error("vcname 不存在！");
            return;
        }
        const vcname2 = vcnameElement.textContent.trim();
        console.log("vcname2", vcname2);
        const ArrayBofList = Array.from(bofList.children);
        console.log("ArrayBofList", ArrayBofList[1]);
        let newVCname;

        ArrayBofList.forEach((child, index) => {
            console.log(`Child ${index}:`, child.innerText.trim());
        });

        if (vcname2 && derection === "back") {
            let currentIndex = ArrayBofList.findIndex(child => vcname2 === child.innerText.trim());
            console.log("currentIndex", currentIndex);
            currentIndex = currentIndex - 1;
            if (currentIndex < 0) currentIndex = ArrayBofList.length - 1;
            newVCname = ArrayBofList[currentIndex];
        } else {
            let currentIndex = ArrayBofList.findIndex(child => vcname2 === child.textContent.trim());
            console.log("currentIndex", currentIndex);
            currentIndex = currentIndex + 1;
            if (currentIndex >= ArrayBofList.length) currentIndex = 0;
            newVCname = ArrayBofList[currentIndex];
        }
        console.log("newVCname", newVCname);
        if (newVCname && onVideoElementClicked) {
            onVideoElementClicked(newVCname.textContent.trim());
        }
    }

    function soundSet() {
        const SoundBoard = document.getElementById("SoundBoard");
        const targetVideo = document.getElementById("targetVideo");
        const volumeDot = document.getElementById("volumeDot");
        const volumeValue = document.getElementById("volumeValue");
        let hideTimeout = null;

        if (SoundBoard && volumeDot && volumeValue) {
            SoundBoard.style.display = SoundBoard.style.display === "none" ? "flex" : "none";
            let isDragging = false;
            volumeDot.addEventListener("mousedown", (e) => { isDragging = true; });
            document.addEventListener("mouseup", () => { isDragging = false; });
            SoundBoard.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    const lineRect2 = volumeDot.parentElement.getBoundingClientRect();
                    const maxY = lineRect2.height;
                    const mouseY = e.clientY - lineRect2.top;
                    let newTop = Math.min(Math.max(mouseY, 0), maxY);
                    volumeDot.style.top = `${newTop}px`;
                    volumeValue.textContent = `${Math.round(100 - (newTop / maxY) * 100)}`;
                    targetVideo.volume = 1 - (newTop / maxY);
                }
                resetHideTimeout();
            });
            document.addEventListener("mousemove", (e) => {
                if (!SoundBoard.contains(e.target)) { resetHideTimeout(); }
            });
            function resetHideTimeout() {
                if (hideTimeout) { clearTimeout(hideTimeout); }
                hideTimeout = setTimeout(() => {
                    SoundBoard.style.display = "none";
                    hideTimeout = null;
                }, 3000);
            }
        }
    }

    function ZimuSet() {
        const newZimuF = document.createElement("input");
        newZimuF.type = "file";
        newZimuF.accept = ".srt, .vtt, .ttml";
        newZimuF.onchange = () => {
            const gotfsZM = newZimuF.files[0];
            if (gotfsZM) {
                parseSubtitleFile(gotfsZM);
            }
        };
        newZimuF.click();
    }

    function parseSubtitleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const extension = file.name.split('.').pop().toLowerCase();
            let subtitles = [];

            switch (extension) {
                case 'srt':
                    subtitles = parseSRT(content);
                    break;
                case 'vtt':
                    subtitles = parseVTT(content);
                    break;
                case 'ttml':
                    subtitles = parseTTML(content);
                    break;
                default:
                    console.error("不支持的字幕格式");
                    return;
            }

            const targetVideo = document.getElementById("targetVideo");
            targetVideo.ontimeupdate = () => {
                const currentTime = targetVideo.currentTime;
                const currentSubtitle = findCurrentSubtitle(subtitles, currentTime);
                displaySubtitle(currentSubtitle);
            };
        };
        reader.readAsText(file);
    }

    function parseSRT(content) {
        const subtitles = [];
        const blocks = content.split(/\n\s*\n/); // 按空行分割字幕块
        blocks.forEach(block => {
            const lines = block.split('\n');
            if (lines.length >= 3) {
                const timecode = lines[1].split(' --> ');
                const start = parseTimecode(timecode[0]);
                const end = parseTimecode(timecode[1]);
                const text = lines.slice(2).join('\n').trim();
                subtitles.push({ start, end, text });
            }
        });
        return subtitles;
    }

    function parseVTT(content) {
        const subtitles = [];
        const lines = content.split('\n');
        let currentSubtitle = null;

        lines.forEach(line => {
            if (line.includes('-->')) {
                const timecode = line.split(' --> ');
                const start = parseTimecode(timecode[0]);
                const end = parseTimecode(timecode[1]);
                currentSubtitle = { start, end, text: '' };
                subtitles.push(currentSubtitle);
            } else if (currentSubtitle && line.trim()) {
                currentSubtitle.text += line.trim() + '\n';
            }
        });

        return subtitles;
    }

    function parseTTML(content) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        const subtitles = [];

        const cues = xmlDoc.getElementsByTagName('p');
        Array.from(cues).forEach(cue => {
            const start = parseTTMLTime(cue.getAttribute('begin'));
            const end = parseTTMLTime(cue.getAttribute('end'));
            const text = cue.textContent.trim();
            subtitles.push({ start, end, text });
        });

        return subtitles;
    }

    function parseTimecode(timecode) {
        const parts = timecode.replace(',', '.').split(':');
        const hh = parseFloat(parts[0]);
        const mm = parseFloat(parts[1]);
        const ss = parseFloat(parts[2]);
        return hh * 3600 + mm * 60 + ss;
    }

    function parseTTMLTime(timecode) {
        const parts = timecode.split(':');
        const hh = parseFloat(parts[0]);
        const mm = parseFloat(parts[1]);
        const ss = parseFloat(parts[2]);
        return hh * 3600 + mm * 60 + ss;
    }

    function findCurrentSubtitle(subtitles, currentTime) {
        return subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
    }

    function displaySubtitle(subtitle) {
        const subtitleElement = document.getElementById('subtitle');
        if (subtitle) {
            subtitleElement.textContent = subtitle.text;
        } else {
            subtitleElement.textContent = '';
        }
    }

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsfullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    function screenSet(){
        const videoContainer = document.getElementById("videoContainer");
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().then(r => console.error("播放失败：", r));
            setIsfullscreen(true);
        }else {
            document.exitFullscreen().then(r => console.error("播放失败：", r));
            setIsfullscreen(false);
        }
    }

    return (
        <>
            <div className={"flex flex-col w-[95%] relative mx-auto"}>
                <div className="absolute m-0 flex w-full bg-gray-400 h-1 cursor-pointer" id={"totalLong"}>
                    <div className="relative h-1 bg-blue-600 border-solid mb-2 rounded-2xl" style={{width: `${progress}px`}}>
                        <div className="absolute w-3 h-3 bg-white rounded-full hover:w-4 hover:h-4 cursor-pointer" style={{top: "0%", left: `${progress-1}px`, transform: "translate(-50%, -50%)"}}></div>
                    </div>
                </div>
                <div className={"flex flex-row justify-between mt-2 w-full"}>
                    <div>
                        <p className={"text-white"}>
                            <span>{currentTime}</span>/<span>{totalDuration}</span>
                        </p>
                    </div>
                    <div className={"flex flex-row"}>
                        <img src={"/ico/music-back.svg"} className={"w-6 h-6 ml-2 invert cursor-pointer"} alt="back" onClick={()=>{backForward("back")}}/>
                        <img src={isPlaying ? "/ico/pause.svg" : "/ico/play.svg"} className={"w-5 h-5 ml-2 invert cursor-pointer"} onClick={videoplay} alt="play/pause"/>
                        <img src={"/ico/fast-forward.svg"} className={"w-6 h-6 ml-2 invert cursor-pointer"} alt="forward" onClick={()=>{backForward("forward")}}/>
                        <img src={"/ico/sound.svg"} className={"w-6 h-6 ml-2 invert cursor-pointer"} alt="sound" onClick={soundSet}/>
                        <img src={"/ico/subtitles.svg"} className={"w-6 h-6 ml-2 invert cursor-pointer"} alt="subtitles" onClick={ZimuSet}/>
                        <img src={"/ico/settings.svg"} className={"w-6 h-6 ml-2 invert cursor-pointer"} alt="settings" />
                        <img src={isfullscreen? "/ico/exitfullscreen.svg":"/ico/fullscreen.svg"} className={"w-6 h-6 ml-2 invert cursor-pointer"} alt="fullscreen" onClick={screenSet}/>
                    </div>
                    <div className={"bg-gray-500 w-10 rounded-lg absolute top-[-1em] flex-col items-center z-10 h-32 -translate-x-1/2 -translate-y-full right-16 hidden"} id={"SoundBoard"}>
                        <span id="volumeValue" className={"text-black"}>100</span>
                        <div className={`relative w-1 h-20 bg-blue-600 border-solid mb-2 rounded-2xl mt-2`}>
                            <div id="volumeDot" className="absolute w-3 h-3 bg-white rounded-full cursor-pointer" style={{top: "0%", left: "50%", transform: "translate(-50%, -50%)"}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}