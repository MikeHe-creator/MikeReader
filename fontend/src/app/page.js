"use client";
import { useState, useEffect } from 'react';
import './globals.css';
import Link from "next/link";

export default function MikeReader() {
    const homePIC = ["/chahua/book.png", "/chahua/music.png", "/chahua/video.png", "/chahua/collection.png"];
    const backgroundColor = ["#f16a6a", "#f1c66a", "#78f16a", "#6ab9f1"];
    let [currentImage, setCurrentImage] = useState(homePIC[0]);
    let [currentBgColor, setCurrentBgColor] = useState(backgroundColor[0]);
    let [currentIntroduce, setCurrentIntroduce] = useState("");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const circle = document.createElement('div');
        circle.setAttribute('id', 'circle');
        circle.style.position = "absolute";
        const radius = 300;
        circle.style.width = `${radius * 2}px`;
        circle.style.height = `${radius * 2}px`;
        circle.style.borderRadius = "50%";
        circle.style.pointerEvents = "none";
        circle.style.zIndex = "-1";
        circle.style.background = "radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%)";
        if(window.innerWidth > 425){
            document.body.appendChild(circle);
        }

        const updateCirclePosition = (e) => {
            const { clientX, clientY } = e;
            const x = Math.min(Math.max(clientX - radius, 0), window.innerWidth - radius * 2);
            const y = Math.min(Math.max(clientY - radius, 0), window.innerHeight - radius * 2);
            circle.style.left = `${clientX - radius}px`;
            circle.style.top = `${clientY - radius}px`;
        };

        document.addEventListener('mousemove', updateCirclePosition);

        return () => {
            console.log("Removing circle");
            document.removeEventListener('mousemove', updateCirclePosition);
            const circleElement = document.getElementById('circle');
            if (circleElement) {
                document.body.removeChild(circleElement);
            }
        };
    }, []);

    function thisIntroduce(index) {
        switch(index) {
            case 0:
                return "introduce1 for book";
            case 1:
                return "introduce2 for music";
            case 2:
                return "introduce3 for video";
            case 3:
                return "introduce4 for collection";
            default:
                return "";
        }
    }

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            index = (index + 1) % homePIC.length;
            setCurrentImage(homePIC[index]);
            setCurrentBgColor(backgroundColor[index]);
            setCurrentIntroduce(thisIntroduce(index));
            document.body.style.backgroundColor = backgroundColor[index];
        }, 3000);

        return () => {
            clearInterval(interval);
            document.body.style.backgroundColor = "";
        };
    }, []);

    return (
        <>
            <div className="grid place-content-center lg:mt-10 mt-8 ml-2">
                <h1 className={"font-bold text-5xl"}>Welcome to MikeReader</h1>
            </div>
            <div className={"flex justify-center lg:mt-40 mt-20 flex-wrap"}>
                <img className={"lg:w-[20vw] lg:h-[20vw] w-[60vw] h-[60vw] rounded-3xl"} src={currentImage} alt={"首页图片"} />
                <div className={"lg:ml-[10%] mt-5"}>
                    <p className={"text-3xl"}>{currentIntroduce}</p>
                </div>
            </div>
            <div className={"flex justify-center flex-wrap mt-8"}>
                <button className={"ml-5 mt-2 border-4 bg-blue-300 border-blue-500 rounded-2xl w-40"} onMouseEnter={()=>{
                    setCurrentImage(homePIC[0]);
                    setCurrentBgColor(backgroundColor[0]);
                    setCurrentIntroduce(thisIntroduce(0));
                }}>
                    <Link href={"/Book"} className={"text-3xl"} >Book</Link>
                </button>
                <button className={"ml-5 mt-2 border-4 bg-blue-300 border-blue-500 rounded-2xl w-40"} onMouseEnter={()=>{
                    setCurrentImage(homePIC[1]);
                    setCurrentBgColor(backgroundColor[1]);
                    setCurrentIntroduce(thisIntroduce(1));
                }}>
                    <Link href={"/Music"} className={"text-3xl"}>Music</Link>
                </button>
                <button className={"ml-5 mt-2 border-4 bg-blue-300 border-blue-500 rounded-2xl w-40"} onMouseEnter={()=>{
                    setCurrentImage(homePIC[2]);
                    setCurrentBgColor(backgroundColor[2]);
                    setCurrentIntroduce(thisIntroduce(2));
                }}>
                    <Link href={"/Video"} className={"text-3xl"}>Video</Link>
                </button>
                {/*<button className={"ml-5 mt-2 border-4 bg-blue-300 border-blue-500 rounded-2xl w-40"} onMouseEnter={()=>{*/}
                {/*    setCurrentImage(homePIC[3]);*/}
                {/*    setCurrentBgColor(backgroundColor[3]);*/}
                {/*    setCurrentIntroduce(thisIntroduce(3));*/}
                {/*}}>*/}
                {/*    <Link href={"/Collection"} className={"text-3xl"}>Collection</Link>*/}
                {/*</button>*/}
            </div>
        </>
    );
}