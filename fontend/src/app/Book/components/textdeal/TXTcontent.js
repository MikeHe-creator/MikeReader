import { useState, useEffect } from "react";

export default function TXTcontent({ TXTsucai }) {

    useEffect(() => {
        if (TXTsucai) {
            loadTxt(TXTsucai);
        }
    }, [TXTsucai]);

    function loadTxt(TXTsucai) {
        const textDisplay = document.getElementById('textDisplay');
        const {textwenben, textfileName} = TXTsucai;
        console.log("textfileName in loadTxt",textfileName);
        Array.from(textDisplay.children).forEach(wenben => {
            wenben.style.display = "none";
        });
        const displayWenben = document.getElementById(`text_${textfileName}`);
        if (displayWenben) {displayWenben.style.display = "block";}

        const preText = document.createElement('pre');
        const preTxtDiv = document.createElement("div");
        preTxtDiv.id = `text_${textfileName}`;
        const reader = new FileReader();
        reader.onload = function (e) {
            preText.innerHTML = e.target.result;
            preTxtDiv.appendChild(preText);
            textDisplay.appendChild(preTxtDiv);
            const preTextWidth = window.innerWidth * 0.93;
            preText.style.cssText = `width: ${preTextWidth}px; height:95vh; word-wrap: break-word; white-space: pre-line;margin:1% 0;padding: 0;`
        };
        if(textwenben){reader.readAsText(textwenben);}

        window.addEventListener('resize', () => {
            const preTextWidth = window.innerWidth * 0.93;
            preText.style.cssText = `width: ${preTextWidth}px; height:95vh; word-wrap: break-word; white-space: pre-line;margin:1% 0;padding: 0;`
        });

    }

    return (
        <>
            <div>
                <div id="textDisplay" className="absolute ml-[5%] w-[95%] h-[98vh] overflow-auto"></div>
                <div id="epubxinxi" className="fixed bottom-0 w-full bg-gray-400 z-[0]"
                     style={{transition: 'width 0.3s ease'}}>
                    <div className="flex justify-center items-center"><p>Welcome to MikeReader!</p></div>
                </div>
            </div>
        </>
    );
}