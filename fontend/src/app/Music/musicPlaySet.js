let musicShuju = {};
export const CPInforList = async (listXingxis, setCpcover, setIsPlaying, setjintuChang,musicStore) => {
    let lastAddedMusicF = null;
    for (const [musicF, data] of Object.entries(listXingxis)) {
        lastAddedMusicF = musicF;
        const jsonPath = data.jsonPath;
        const exitedGD = document.getElementById(`${musicF}`);
        try {
            const response = await fetch(`http://localhost:8080${jsonPath}`);
            const yydata = await response.json();
            if (!exitedGD) {
                const artist = yydata.artist;
                const album = yydata.album;
                const title = yydata.title;
                const duration = yydata.duration;
                const cover = yydata.cover;
                const musicSource=MusicBlob(musicStore,musicF);
                let imageSrc;
                if (cover) {
                    imageSrc = `http://localhost:8080${cover}`;
                } else {
                    imageSrc = "../chahua/enjoy_muisc.png";
                }
                const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
                const seconds = (duration % 60).toString().padStart(2, '0');
                const formattedDuration = `${minutes}:${seconds}`;
                musicShuju[musicF] = { artist:artist, album:album, title:title, duration:duration,imageSrc:imageSrc,formattedDuration:formattedDuration,musicSource:musicSource};
                makeGeDanList(setjintuChang, setIsPlaying,musicF,setCpcover);
                const zuiXinxx = musicShuju[lastAddedMusicF];
                gequPlaySet(zuiXinxx,setCpcover,setIsPlaying,setjintuChang,musicF);
                //console.log("musicShuju",musicShuju)
                //console.log("zuiXinxx",zuiXinxx)
            }
        } catch (error) {
            console.error('Error fetching music data:', error);
        }
    }
    return musicShuju;
};

function MusicBlob(musicStore, musicF) {
    const audioFile = musicStore[musicF];
    if (!audioFile) {
        console.error("未找到对应的音频文件");
        return null;
    }
    return URL.createObjectURL(audioFile);
}

function makeGeDanList(setjintuChang, setIsPlaying,musicF,setCpcover){
    const gd_content = document.getElementById("gd_content");
    const { imageSrc, title, artist, album, formattedDuration } = musicShuju[musicF];
    //console.log("imageSrc",imageSrc)
    const gdDiv = document.createElement("div");
    gdDiv.id = `${musicF}`;
    gdDiv.className="flex justify-center items-center mt-5";
    let display_title = title === "" ? musicF : title;
    gdDiv.dataset.SongName = `${display_title}`;

    gdDiv.innerHTML =
        `<div><img src='${imageSrc}' alt="专辑封面" class="w-[50px] h-[50px]"/></div>
         <div class="ml-2 w-[45vw] lg:w-[8vw] flex flex-col justify-start">
            <p class="flex flex-col">
                <span class="overflow-hidden whitespace-nowrap text-ellipsis" id="title">${display_title}</span>
                <span class="overflow-hidden whitespace-nowrap text-ellipsis text-gray-600" id="artist">${artist}</span>
                <span class="overflow-hidden whitespace-nowrap text-ellipsis text-gray-600 lg:hidden flex">${album}</span>
            </p>
         </div>
         <div class="ml-[3%] w-[20px] flex flex-row text-center gequOperate">
            <span class="lg:block hidden cursor-pointer" id="bof">▶️</span>
            <span class="lg:block hidden cursor-pointer" id="xiayiq">⬇️</span>
            <span class="lg:block hidden cursor-pointer" id="yichu">🗑️</span>
            <span class="lg:block hidden cursor-pointer" id="fuzhi">📚</span>
            <span class="lg:hidden block cursor-pointer" id="gengd">➕</span>
         </div>
         <div class="ml-[15%] w-[100px] lg:w-[300px] lg:flex overflow-hidden whitespace-nowrap text-ellipsis text-center hidden ">${album}</div>
         <div class="ml-[5%] w-[10px] text-center" id="duration">${formattedDuration}</div>`;
    gd_content.insertBefore(gdDiv, gd_content.firstChild);
    BackForward(setjintuChang, setIsPlaying,musicF,setCpcover);
    gdChildOp(gd_content,setjintuChang, setIsPlaying,musicF,setCpcover);
}

function gdChildOp(gd_content, setjintuChang, setIsPlaying, musicF, setCpcover) {
    const escapedId = CSS.escape(musicF);

    const handlePlay = () => {
        const zuiXinxx = musicShuju[musicF];
        gequPlaySet(zuiXinxx, setCpcover, setIsPlaying, setjintuChang, musicF);
    };

    const handleMoveDown = () => {
        const allSongs = Array.from(gd_content.children);
        const currentSongIndex = allSongs.findIndex(song => song.id === musicF);
        if (currentSongIndex === -1) return;
        const songToMove = allSongs.splice(currentSongIndex, 1)[0];
        allSongs.splice(currentSongIndex + 1, 0, songToMove);
        gd_content.innerHTML = '';
        allSongs.forEach(song => gd_content.appendChild(song));
    };

    const handleRemove = () => {
        const songToRemove = document.getElementById(musicF);
        if (songToRemove && songToRemove.parentNode === gd_content) {
            gd_content.removeChild(songToRemove);
        }
    };

    const handleCopy = () => {
        const title = document.querySelector(`#${escapedId} #title`).textContent;
        const artist = document.querySelector(`#${escapedId} #artist`).textContent;
        const textToCopy = `${title} - ${artist}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                //console.log("复制成功:", textToCopy);
                alert("已复制到剪贴板: " + textToCopy);
            })
            .catch((err) => {
                console.error("复制失败:", err);
                alert("复制失败，请手动复制");
            });
    };

    const Gdspan1 = document.querySelector(`#${escapedId} .gequOperate span:nth-child(1)`);
    Gdspan1.addEventListener("click", handlePlay);
    const Gdspan2 = document.querySelector(`#${escapedId} .gequOperate span:nth-child(2)`);
    Gdspan2.addEventListener("click", handleMoveDown);
    const Gdspan3 = document.querySelector(`#${escapedId} .gequOperate span:nth-child(3)`);
    Gdspan3.addEventListener("click", handleRemove);
    const Gdspan4 = document.querySelector(`#${escapedId} .gequOperate span:nth-child(4)`);
    Gdspan4.addEventListener("click", handleCopy);

    const Gdspan5 = document.querySelector(`#${escapedId} .gequOperate span:nth-child(5)`);
    Gdspan5.addEventListener("click", (event) => {
        event.stopPropagation();
        const selectedMenu = document.createElement("div");
        selectedMenu.style.cssText = `background-color: white;position: fixed;bottom: 0;left: 0;width: 100%;display: flex;flex-direction: column;align-items: center;
            z-index: 1000;box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);padding: 10px 0;`;
        selectedMenu.innerHTML = `
            <div class="flex flex-col gequOperate" style="width: 100%;">
                <span id="bof" class="cursor-pointer p-2 hover:bg-gray-100 w-full text-center">▶️ Play</span>
                <span id="xiayiq" class="cursor-pointer p-2 hover:bg-gray-100 w-full text-center">⬇️ next</span>
                <span id="yichu" class="cursor-pointer p-2 hover:bg-gray-100 w-full text-center">🗑️ Remove</span>
                <span id="fuzhi" class="cursor-pointer p-2 hover:bg-gray-100 w-full text-center">📚 Copy</span>
            </div>
        `;
        document.body.appendChild(selectedMenu);
        const menuBof = selectedMenu.querySelector("#bof");
        const menuXiayiq = selectedMenu.querySelector("#xiayiq");
        const menuYichu = selectedMenu.querySelector("#yichu");
        const menuFuzhi = selectedMenu.querySelector("#fuzhi");

        menuBof.addEventListener("click", () => {
            handlePlay();
            document.body.removeChild(selectedMenu);
        });
        menuXiayiq.addEventListener("click", () => {
            handleMoveDown();
            document.body.removeChild(selectedMenu);
        });
        menuYichu.addEventListener("click", () => {
            handleRemove();
            document.body.removeChild(selectedMenu);
        });
        menuFuzhi.addEventListener("click", () => {
            handleCopy();
            document.body.removeChild(selectedMenu);
        });
        const closeMenu = (event) => {
            if (!selectedMenu.contains(event.target)) {
                document.body.removeChild(selectedMenu);
                document.removeEventListener("click", closeMenu);
            }
        };
        setTimeout(() => {
            document.addEventListener("click", closeMenu);
        }, 0);
    });
}

function gequPlaySet(zuiXinxx,setCpcover,setIsPlaying,setjintuChang,musicF){
    const {title,artist,imageSrc,formattedDuration,duration} =zuiXinxx;
    let display_title = title === "" ? musicF : title;
    setCpcover(imageSrc);
    const CPfengmian=document.getElementById("CPfengmian");
    const musicName=document.getElementById("musicName");
    const musicAuthor=document.getElementById("musicAuthor");
    const musicTime=document.getElementById("musicTime");
    CPfengmian.innerHTML=`<img src='${imageSrc}' alt="当前播放音乐的唱片封面"/>`
    musicName.innerText=display_title;
    musicAuthor.innerText=artist;
    musicName.style.cssText = `white-space: nowrap;overflow: hidden;text-overflow: ellipsis;`;
    musicAuthor.style.cssText = `white-space: nowrap;overflow: hidden;text-overflow: ellipsis;`;
    musicTime.innerHTML = `<span>00:00</span>/<span>${formattedDuration}</span>`;
    gequPlayNow(musicF, setIsPlaying, setjintuChang,duration,formattedDuration,setCpcover);
}

let isEventListenerBound = false;
function gequPlayNow(musicF, setIsPlaying, setjintuChang, duration, formattedDuration,setCpcover) {
    let audioElement = document.getElementById("currentPlay");
    const playornotICO = document.getElementById("playornotICO");
    if (!audioElement) {
        audioElement = document.createElement("audio");
        audioElement.id = "currentPlay";
        audioElement.style.display = "none";
        document.body.appendChild(audioElement);
        audioElement.addEventListener("ended", () => {
            BofangQiehuan(setCpcover,setIsPlaying,setjintuChang)
        });
    }

    if (!isEventListenerBound) {
        playornotICO.removeEventListener("click", togglePlayPause);
        playornotICO.addEventListener("click", togglePlayPause);
        isEventListenerBound = true; // 标记为已绑定
    }
    function togglePlayPause() {
        if (audioElement.paused) {
            //console.log("此歌曲在播放？", audioElement.paused);
            audioElement.play();
            setIsPlaying(true);
            updateBofButton(musicF, true);
        } else {
            //console.log("此歌曲在播放？", audioElement.paused);
            audioElement.pause();
            setIsPlaying(false);
            updateBofButton(musicF, false);
        }
    }

    timeRun(setjintuChang, setIsPlaying, duration, formattedDuration);
    audioElement.pause();
    audioElement.dataset.currentSongName = musicF;
    audioElement.src = `http://localhost:8080/Readeruser/music/temp-${musicF}/${musicF}`;
    audioElement.load();
    //console.log("audioElement.src", audioElement.src);
    audioElement.addEventListener('canplaythrough', () => {
        audioElement.play().catch(err => console.error("播放失败:", err));
    }, { once: true });
    setIsPlaying(true);
    updateBofButton(musicF, true);
    geciLoard(setjintuChang, setIsPlaying);
}

function updateBofButton(musicF, isPlaying) {
    const allBofButtons = document.querySelectorAll("#gd_content #bof");
    allBofButtons.forEach(button => {
        if (button.parentElement.parentElement.id === musicF) {
            button.innerText = isPlaying ? "⏸️" : "▶️";
        } else {
            button.innerText = "▶️";
        }
    });
}

function geciLoard(setjintuChang,setIsPlaying) {
    const geci = document.getElementById("geci");
    geci.innerHTML = "";
    if (!geci.innerHTML) {
        geci.innerHTML = `<p><span class="text-blue-500 cursor-pointer">Click here</span> to load the lyric file</p>`;
        const span = geci.querySelector("span");
        span.addEventListener("click", ()=>{geciSet(setjintuChang,setIsPlaying)});
    }
}

let lyricText
function geciSet(setjintuChang,setIsPlaying) {
    const geci = document.getElementById("geci");
    const lyricInput = document.createElement('input');
    lyricInput.type = "file";
    lyricInput.accept = ".lrc";
    lyricInput.onchange = () => {
        const file = lyricInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                lyricText = event.target.result;
                geci.innerHTML = "";
                displayLyric(lyricText,setjintuChang,setIsPlaying);
            };
            reader.readAsText(file);
        } else {
            console.error("No file selected.");
        }
    };
    lyricInput.click();
}

function displayLyric(lyricText,setjintuChang,setIsPlaying) {
    const geci = document.getElementById("geci");
    const geciDIV2 = document.createElement("div");
    geciDIV2.id = "geciDIV2";
    //geciDIV2.className = "lg:h-[60vh] h-[calc(35vh-100px)] overflow-y-auto";

    geci.addEventListener('scroll', () => {
        geci.style.scrollbarWidth = 'thin';
        geci.style.scrollbarColor = 'rgba(0, 0, 0, 0.2) transparent';
    });
    geci.addEventListener('mouseleave', () => {
        geci.style.scrollbarWidth = 'none';
        geci.style.scrollbarColor = 'transparent transparent';
    });

    const standardizedText = lyricText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[\u200B\u3000]/g, '');
    const lines = standardizedText.split('\n');
    //console.log("lines", lines);
    lines.forEach(line => {
        const regex = /\[(\d{2}:\d{2}(?::\d{2})?(?:\.\d{2,3})?)\]\s*(.*)/;
        const matchline = line.match(regex);
        //console.log("matchline", matchline);
        if (matchline) {
            const lineP = document.createElement('p');
            const timestamp = matchline[1];
            lineP.textContent = matchline[2];
            lineP.dataset.timestamp = timestamp;
            geciDIV2.appendChild(lineP);
        }else{
            console.warn("无效的歌词行:", line);
        }
    });
    geci.appendChild(geciDIV2);
    geciAndTime(setjintuChang,setIsPlaying);
}

let interval = null;
function timeRun(setjintuChang, setIsPlaying) {
    const musicTime = document.getElementById("musicTime");
    const currentTimeSpan = musicTime.querySelector("span:first-child");
    const durationSpan = musicTime.querySelector("span:last-child");
    const parseTime = (timeText) => {
        const [minutes, seconds] = timeText.split(":").map(Number);
        return minutes * 60 + seconds;
    };
    const currentTimeText = currentTimeSpan.innerText;
    const durationText = durationSpan.innerText;
    let currentTime = parseTime(currentTimeText);
    const duration = parseTime(durationText);
    const currentPlay = document.getElementById("currentPlay");
    const updateTimeDisplay = () => {
        const minutes = String(Math.floor(currentTime / 60)).padStart(2, '0');
        const seconds = String(Math.floor(currentTime % 60)).padStart(2, '0');
        musicTime.innerHTML = `<span>${minutes}:${seconds}</span>/<span>${durationText}</span>`;
    };
    if (interval !== null) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        if (!currentPlay.paused) {
            currentTime = currentPlay.currentTime;
            if (currentTime >= duration) {
                currentTime = 0;
                clearInterval(interval);
            }
            updateTimeDisplay();
            timeLine(currentTime, duration, setjintuChang, setIsPlaying);
        } else {
            currentTime = currentPlay.currentTime;
            updateTimeDisplay();
            timeLine(currentTime, duration, setjintuChang, setIsPlaying);
        }
    }, 1000);
}

function timeLine(currentTime, duration, setjintuChang, setIsPlaying) {
    //console.log("当前时长 timeLine", duration);
    const playerRQ = document.getElementById("playerRQ");
    const sjzhou = document.getElementById("sjzhou");
    const sjzhouWidth = sjzhou.clientWidth;
    const RQwidth = playerRQ.clientWidth;

    if (!isNaN(duration) && duration > 0) {
        const newWidth = (currentTime / duration) * RQwidth;
        setjintuChang(newWidth);
    }

    sjzhou.addEventListener("click", (e) => {
        const rect = sjzhou.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / sjzhouWidth) * duration;
        const audioElement = document.getElementById("currentPlay");
        if (audioElement) {
            audioElement.currentTime = newTime;
            audioElement.play();
            setIsPlaying(true);
            setjintuChang((newTime / duration) * RQwidth);
        }
    });
}

let lastHighlighted = null;
let intervalId;
function geciAndTime(setjintuChang,setIsPlaying) {
    const geciDiv2 = document.getElementById("geciDIV2");
    let pressTimer;
    if (intervalId) clearInterval(intervalId);
    geciDiv2.addEventListener('mousedown', (event) => {
        Array.from(geciDiv2.children).forEach((el) => {
            el.style.fontWeight = "normal";
            el.style.fontSize = "16px";
        })
        const geciElement = event.target;
        pressTimer = setTimeout(() => {
            geciElement.style.fontWeight = "bold";
            geciElement.style.fontSize = "20px";
            let timestamp = geciElement.dataset.timestamp;
            timestamp = timestamp.substring(0, 5);
            const timeParts = timestamp.split(":");
            const minutes = parseInt(timeParts[0], 10);
            const seconds = parseInt(timeParts[1], 10);
            const totalSeconds = minutes * 60 + seconds;
            if (isNaN(totalSeconds) || !isFinite(totalSeconds)) {
                console.error("Invalid timestamp:", timestamp);
                return;
            }
            const audioElement = document.getElementById("currentPlay");
            audioElement.currentTime = totalSeconds;
            audioElement.play();
            setIsPlaying(true);
            timeRun(setjintuChang,setIsPlaying)
        }, 500);
    });
    geciDiv2.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
    });
    geciDiv2.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
    });

    intervalId = setInterval(() => {
        const currentTime = document.querySelector("#musicTime span:first-child").textContent;
        const currentTimeFormatted = currentTime.substring(0, 5);
        let currentHighlighted = null;
        Array.from(geciDiv2.children).forEach((geciElement) => {
            const timestamp = geciElement.dataset.timestamp;
            const timestampFormatted = timestamp.substring(0, 5);
            if (currentTimeFormatted === timestampFormatted) {
                geciElement.style.fontWeight = "bold";
                geciElement.style.fontSize = "20px";
                currentHighlighted = geciElement;
                if (lastHighlighted && lastHighlighted !== geciElement) {
                    lastHighlighted.style.fontWeight = "normal";
                    lastHighlighted.style.fontSize = "16px";
                }
            }
        });
        if (currentHighlighted && lastHighlighted !== currentHighlighted) {
            lastHighlighted = currentHighlighted;
            currentHighlighted.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, 1000);
}

function voiceSet() {
    const soundCtrl = document.getElementById("soundCtrl");
    const soundsBoard = document.getElementById("soundsBoard");
    const volumeDot = document.getElementById("volumeDot");
    const volumeValue = document.getElementById("volumeValue");
    let hideTimeout = null;
    const currentplay=document.getElementById("currentPlay");

    if (soundCtrl && soundsBoard && volumeDot && volumeValue) {
        soundCtrl.onclick = () => {
            soundsBoard.style.display = "flex";
            const soundCtrlRect = soundCtrl.getBoundingClientRect();
            const distanceFromLeft = soundCtrlRect.left;
            const soundCtrlWidth = soundCtrlRect.width;
            soundsBoard.style.left = `${distanceFromLeft + soundCtrlWidth / 2}px`;
            resetHideTimeout();
        };

        let isDragging = false;
        volumeDot.addEventListener("mousedown", (e) => {isDragging = true;});
        document.addEventListener("mouseup", () => {isDragging = false;});
        soundsBoard.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const lineRect = volumeDot.parentElement.getBoundingClientRect();
                const maxY = lineRect.height;
                const mouseY = e.clientY - lineRect.top;
                let newTop = Math.min(Math.max(mouseY, 0), maxY);
                volumeDot.style.top = `${newTop}px`;
                volumeValue.textContent = `${Math.round(100 - (newTop / maxY) * 100)}`;
                currentplay.volume=1-(newTop / maxY);
            }
            resetHideTimeout();
        });

        document.addEventListener("mousemove", (e) => {
            if (!soundsBoard.contains(e.target)) {resetHideTimeout();}
        });
        function resetHideTimeout() {
            if (hideTimeout) {clearTimeout(hideTimeout);}
            hideTimeout = setTimeout(() => {
                soundsBoard.style.display = "none";
                hideTimeout = null;
            }, 3000);
        }
    }
}
window.addEventListener("click", voiceSet)

function BofangQiehuan(setCpcover,setIsPlaying,setjintuChang){
    const bofqieh=document.getElementById("bofqieh");
    const boffs=bofqieh.data;
    const gd_content = document.getElementById("gd_content");
    const childrenArray = Array.from(gd_content.children);
    if(boffs==="http://localhost:3000/ico/shuffle.svg"){
        Shuffle(childrenArray,setCpcover,setIsPlaying,setjintuChang);
    }else if(boffs==="http://localhost:3000/ico/order-play.svg"){
        const loopPlay=false
        OrderPlay(childrenArray,setCpcover,setIsPlaying,setjintuChang,loopPlay);
    }else if(boffs==="http://localhost:3000/ico/list-loop.svg"){
        const loopPlay=true;
        OrderPlay(childrenArray,setCpcover,setIsPlaying,setjintuChang,loopPlay);
    }else{
        SingleLoop(childrenArray,setCpcover,setIsPlaying,setjintuChang);
    }
}

function Shuffle(childrenArray, setCpcover, setIsPlaying, setjintuChang) {
    const randomIndex = Math.floor(Math.random() * childrenArray.length);
    const randomElement = childrenArray[randomIndex];
    const musicF = randomElement.id;
    const zuiXinxx = musicShuju[musicF];
    if (!zuiXinxx) {
        console.error("未找到歌曲数据:", musicF);
        return;
    }
    gequPlaySet(zuiXinxx, setCpcover, setIsPlaying, setjintuChang, musicF);
}

function OrderPlay(childrenArray, setCpcover, setIsPlaying, setjintuChang, loopPlay) {
    let audioElement = document.getElementById("currentPlay");
    let currentIndex = childrenArray.findIndex(child => child.id === audioElement.dataset.currentSongName);
    if (currentIndex === -1) return;
    const playSong = (currentIndex) => {
        if (currentIndex < 0 || currentIndex >= childrenArray.length) return;
        const currentElement = childrenArray[currentIndex];
        const musicF = currentElement.id;
        const zuiXinxx = musicShuju[musicF];
        gequPlaySet(zuiXinxx, setCpcover, setIsPlaying, setjintuChang, musicF);
    };
    currentIndex++;
    if (currentIndex < childrenArray.length) {
        playSong(currentIndex);
    } else {
        if (loopPlay) {
            currentIndex = 0;
            playSong(currentIndex);
        } else {
            setIsPlaying(false);
            updateBofButton(childrenArray[currentIndex - 1].id, false);
            audioElement.currentTime = 0;
        }
    }
}

function SingleLoop(childrenArray,setCpcover,setIsPlaying,setjintuChang){
    let audioElement = document.getElementById("currentPlay");
    let currentIndex = childrenArray.findIndex(child => child.id === audioElement.dataset.currentSongName);
    if (currentIndex < 0 || currentIndex >= childrenArray.length) return;
    const currentElement = childrenArray[currentIndex];
    const musicF = currentElement.id;
    const zuiXinxx = musicShuju[musicF];
    gequPlaySet(zuiXinxx, setCpcover, setIsPlaying, setjintuChang, musicF);
}

let isInitialized = false;
function BackForward(setjintuChang, setIsPlaying, musicF, setCpcover) {
    if (isInitialized) return;
    isInitialized = true;
    const backforward = document.getElementsByClassName("backforward");
    console.log("backforward", backforward);
    Array.from(backforward).forEach(button => {
        button.addEventListener("click", function () {
            const icon = button.querySelector("object").getAttribute("data");
            if (icon === "/ico/music-back.svg") {
                console.log("Back button clicked");
                playBFSong(-1, setCpcover, setIsPlaying, setjintuChang);
            } else if (icon === "/ico/fast-forward.svg") {
                console.log("Forward button clicked");
                playBFSong(1, setCpcover, setIsPlaying, setjintuChang);
            }
        });
    });
}

function playBFSong(addOrNot, setCpcover, setIsPlaying, setjintuChang) {
    const audioElement = document.getElementById("currentPlay");
    const childrenArray = Array.from(document.getElementById("gd_content").children);
    let currentIndex = childrenArray.findIndex(child => child.id === audioElement.dataset.currentSongName);
    console.log("currentIndex", currentIndex);
    let newIndex = currentIndex + addOrNot;
    console.log("newIndex", newIndex);
    if (newIndex < 0) {
        newIndex = childrenArray.length - 1;
    } else if (newIndex >= childrenArray.length) {
        newIndex = 0;
    }
    const currentElement = childrenArray[newIndex];
    console.log("currentElement", currentElement);
    const musicF = currentElement.id;
    const zuiXinxx = musicShuju[musicF];
    gequPlaySet(zuiXinxx, setCpcover, setIsPlaying, setjintuChang, musicF);
}