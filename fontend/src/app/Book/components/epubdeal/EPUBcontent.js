import {useEffect, useState} from 'react';
import {fanye, shubweiz, zhangjieYeshu} from "@/app/Book/components/epubdeal/EPUBoperate";

export default function EPUBcontent({EPUBcontents,outhref}) {
    const [chapterNum, setChapterNum] = useState(0);
    const [thischapterPage, setThischapterPage] = useState(0);
    const [updatedChapters, setUpdatedChapters] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentChapter, setCurrentChapter] = useState(1);

    if (EPUBcontents != null) {
        const EPUBleirong = document.getElementById("EPUBleirong");
        const { bookname, html, css, img } = EPUBcontents;
        let epubfameDIV = document.getElementById(`epubBook_${bookname}`);
        if (!epubfameDIV) {
            setChapterNum(html.length);
            epubfameDIV = document.createElement('div');
            epubfameDIV.id = `epubBook_${bookname}`;
            epubfameDIV.style.margin="0 5%";
            EPUBleirong.appendChild(epubfameDIV);
            inputhtml(html, epubfameDIV, css, img);
        }

        Array.from(EPUBleirong.children).forEach(wenben => {
            wenben.style.display = "none";
            const displayWenben = document.getElementById(`epubBook_${bookname}`);
            if(displayWenben){
                displayWenben.style.display = "block";
                document.getElementById('epubxinxi').style.display = "block";
            }
        })
    }

    function inputhtml(html, epubfameDIV, css,img) {
        const fetchHtmlContent = async () => {
            for (const item of html) {
                try {
                    const res = await fetch(`http://localhost:8080${item}`);
                    const htmlContent = await res.text();
                    const epubFame = document.createElement('iframe');
                    epubFame.style.width = "98%";
                    epubFame.style.height = "92vh";
                    const updatedHtml = ResourceLinks(htmlContent, css, img);
                    const chapterDiv = document.createElement('div');
                    const hrefHtml = item.split(/[\\/]/).pop();
                    chapterDiv.id = `chapter_${hrefHtml}`;
                    if (!document.getElementById(chapterDiv.id)) {
                        epubFame.srcdoc = updatedHtml;
                        chapterDiv.appendChild(epubFame);
                        epubfameDIV.appendChild(chapterDiv);
                    }

                    chapterDiv.style.display = item === html[0] ? "block" : "none";
                    epubFame.onload = () => {
                        const iframeDoc = epubFame.contentDocument || epubFame.contentWindow.document;
                        updateLayout(iframeDoc,epubfameDIV,chapterDiv)
                        LinkHtml(iframeDoc,epubfameDIV);
                        iframeDoc.addEventListener("click", (e) => {
                            shubweiz(e, epubFame, html, setUpdatedChapters);
                        })
                        window.addEventListener('resize',()=>{updateLayout(iframeDoc,epubfameDIV,chapterDiv)});
                    };
            } catch (err) {
                    console.error("Failed to fetch HTML:", err);
                }
            }
        };
        fetchHtmlContent();
    }

    function ResourceLinks(htmlContent, css, img) {
        const parser = new DOMParser();
        const htmldoc = parser.parseFromString(htmlContent, 'text/html');
        const linkElements = htmldoc.querySelectorAll('link[href]');
        linkElements.forEach(link => {
            const href = link.getAttribute('href').split('/').pop();
            const csspath = css.find(path => path.endsWith(href));
            link.setAttribute('href', `http://localhost:8080${csspath}`);
        });

        const imgElements = htmldoc.querySelectorAll('img[src], svg image');
        imgElements.forEach(imglink => {
            const src = imglink.getAttribute('xlink:href') || imglink.getAttribute('src');
            const filename = src.split('/').pop();
            const Imgpath = img.find(path => path.endsWith(filename));
            if (imglink.getAttribute("src")) {
                imglink.setAttribute('src', `http://localhost:8080${Imgpath}`);
            } else {
                imglink.setAttribute('xlink:href', `http://localhost:8080${Imgpath}`);
            }
            const parentP = imglink.closest('p');
            if (!parentP || !parentP.innerText.trim()) {
                imglink.style.width = "60%";
                imglink.style.height = "60%";
            }
        });
        return htmldoc.documentElement.outerHTML;
    }

    const updateLayout=(iframeDoc,epubfameDIV,chapterDiv)=>{
        const contentBody = iframeDoc.querySelector('body');
        const columnGap = epubfameDIV.clientWidth * 0.06;
        let columnWidth;
        const epubFameWidth = epubfameDIV.clientWidth * 0.98;
        const targetIframe = epubfameDIV.querySelector('iframe');
        const Vertical = targetIframe.contentDocument.querySelector('html').classList.contains('vrtl');
        if(Vertical){
            columnWidth=epubfameDIV.clientHeight;
        }else{
            if (epubFameWidth >= 768) {
                columnWidth = (epubFameWidth) / 2 - columnGap;
            }else{
                columnWidth=epubFameWidth;
            }
        }
        contentBody.style.cssText = `margin: 0; padding: 0; column-fill: auto; column-gap: ${columnGap}px; column-width: ${columnWidth}px; overflow: hidden; width: ${epubFameWidth}px; height: 98vh;`;
        if(chapterDiv.style.display === "block") {
            const columnCount = zhangjieYeshu(contentBody, columnWidth,epubfameDIV)
            if (columnCount > 0) {
                setThischapterPage(columnCount)
            }
        }
    }


    function LinkHtml(iframeDoc,epubfameDIV){
        const allAs = iframeDoc.querySelectorAll('a');
        allAs.forEach(element => {
            element.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const href = element.getAttribute('href');
                const cleanedHref = href.split('#')[0];
                const targetId = cleanedHref.split('/').pop();
                const targetDiv = document.getElementById(`chapter_${targetId}`);
                if (targetDiv === null) {
                    alert("The chapter seems to be loading, please try again later.");
                    const observer = new MutationObserver(() => {
                        const allChapterDivs = document.querySelectorAll('div[id^="chapter_"]');
                        if (targetDiv !== null) {
                            observer.disconnect();
                            Updatechapter(allChapterDivs,epubfameDIV,targetId)
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                } else {
                    const allChapterDivs = document.querySelectorAll('div[id^="chapter_"]');
                    Updatechapter(allChapterDivs,epubfameDIV,targetId)
                }

            }
        })
    }

    function Updatechapter(allChapterDivs, epubfameDIV, targetId) {
        const targetDiv = document.getElementById(`chapter_${targetId}`);
        Array.prototype.forEach.call(allChapterDivs, div => {
            div.style.display = 'none';
        });
        const targetIndex = Array.prototype.findIndex.call(allChapterDivs, div => div === targetDiv);
        setCurrentChapter(targetIndex + 1);
        targetDiv.style.display = 'block';
        const targetIframe = targetDiv.querySelector('iframe');
        const targetIframeDoc = targetIframe.contentDocument || targetIframe.contentWindow.document;
        const chapterDiv = targetDiv;
        updateLayout(targetIframeDoc, epubfameDIV, chapterDiv);
        window.addEventListener('resize', () => {
            updateLayout(targetIframeDoc, epubfameDIV, chapterDiv);
        });
    }

    function jiaJianYe(howtopage){
        const {html}=EPUBcontents;
        const yeDOM=document.getElementById("dqye");
        const zhangDOM=document.getElementById("dqzhang");
        if(yeDOM && zhangDOM) {
            let DangqianYe = parseInt(yeDOM.innerText, 10);
            let DangqianZhang = parseInt(zhangDOM.innerText, 10);
            fanye(howtopage,html,setUpdatedChapters,DangqianYe,DangqianZhang)
        }
    }

    useEffect(() => {
        if (outhref) {
            console.log("outhref", outhref);
            const targetId = outhref.split(/[\\/]/).pop();
            const checkAndUpdate = () => {
                const epubfameDIV = document.getElementById(`chapter_${targetId}`);
                if (epubfameDIV) {
                    clearInterval(intervalId); // 清除轮询
                    const allChapterDivs = document.querySelectorAll('div[id^="chapter_"]');
                    Updatechapter(allChapterDivs, epubfameDIV, targetId);
                }
            };
            const intervalId = setInterval(checkAndUpdate, 100);
            return () => clearInterval(intervalId);
        }
    }, [outhref]);

    useEffect(() => {
        if (updatedChapters) {
            const { allChapterDivs, epubfameDIV, targetId } = updatedChapters;
            Updatechapter(allChapterDivs, epubfameDIV, targetId);
        }
    }, [updatedChapters]);

    useEffect(() => {
        // 将 React 中的状态传递到 window 对象
        window.chapterNum = chapterNum;
        window.thischapterPage = thischapterPage;
        window.currentPage=currentPage;
        window.currentChapter=currentChapter;
    }, [chapterNum, thischapterPage,currentPage,currentChapter]);

    return (
        <div id="EPUBleirong" className=" mt-6 w-full h-full">
            <div id="epubxinxi" className="fixed bottom-0 w-full bg-orange-400 z-[0]" style={{ transition: 'width 0.3s ease' }}>
                <div className="flex justify-center items-center">
                    <div className="inline-flex">
                        <button onClick={()=>jiaJianYe("backPage")}>◀️</button>
                        <span id={'dqye'}>{currentPage}</span>/{thischapterPage}
                        <button onClick={()=>jiaJianYe("addPage")}>▶️</button>
                        (chapter:<span id={'dqzhang'}>{currentChapter}</span>/{chapterNum})
                    </div>
                </div>
            </div>
        </div>
    );
}