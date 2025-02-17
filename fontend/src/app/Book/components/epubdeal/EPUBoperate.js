export const zhangjieYeshu = (contentBody, columnWidth,epubfameDIV) => {
    const targetIframe = epubfameDIV.querySelector('iframe');
    const Vertical = targetIframe.contentDocument.querySelector('html').classList.contains('vrtl');

    let columnCount = 1;
    if(Vertical){
        //横屏也可以采用类似方法
        const contentHeight = contentBody.scrollHeight;
        const columnHeight = contentBody.clientHeight;
        columnCount = Math.floor(contentHeight / columnHeight);
    }else{
        const epubFameWidth = epubfameDIV.clientWidth * 0.98;
        const contentWidth = contentBody.scrollWidth;
        const columnWidth = contentBody.clientWidth;
        if (epubFameWidth >= 768) {
            console.log('contentWidth / columnWidth',contentWidth / columnWidth)
            columnCount = Math.round(contentWidth / columnWidth)*2;
        }else{
            columnCount = Math.round(contentWidth / columnWidth);
        }
    }
    return columnCount;
};

export const shubweiz=(e, epubFame, html, setUpdatedChapters) => {
    const shubX = e.clientX;
    let howtopage;
    if (shubX > epubFame.clientWidth * 0.7) {
        howtopage="addPage";
        const yeDOM=document.getElementById("dqye");
        const zhangDOM=document.getElementById("dqzhang");
        if(yeDOM && zhangDOM){
            let DangqianYe=parseInt(yeDOM.innerText,10);
            let DangqianZhang=parseInt(zhangDOM.innerText,10);
            fanye(howtopage,html,setUpdatedChapters,DangqianYe,DangqianZhang);
        }
    } else if (shubX < epubFame.clientWidth * 0.3) {
        howtopage="backPage";
        const yeDOM=document.getElementById("dqye");
        const zhangDOM=document.getElementById("dqzhang");
        if(yeDOM && zhangDOM){
            let DangqianYe=parseInt(yeDOM.innerText,10);
            let DangqianZhang=parseInt(zhangDOM.innerText,10);
            fanye(howtopage,html,setUpdatedChapters,DangqianYe,DangqianZhang);
        }
    }
};

export function fanye(howtopage,html,setUpdatedChapters,DangqianYe,DangqianZhang){
    const chapterNum = window.chapterNum;
    const thischapterPage = window.thischapterPage;
    const targetId0 = html[DangqianZhang - 1].split(/[\\/]/).pop();
    const epubfameDIV0 = document.getElementById(`chapter_${targetId0}`);
    const targetIframe = epubfameDIV0.querySelector('iframe');
    const Vertical = targetIframe.contentDocument.querySelector('html').classList.contains('vrtl');

    if(howtopage === "addPage"){
        if (Vertical || epubfameDIV0.clientWidth < 768) {
            DangqianYe += 1;
        } else if (!Vertical && epubfameDIV0.clientWidth > 768) {
            DangqianYe += 2;
        }
        if (DangqianYe > thischapterPage) {
            DangqianYe = 1;
            DangqianZhang += 1;
            if (DangqianZhang > chapterNum) {
                DangqianZhang = chapterNum;  // 限制最大章节数
            }
            gengxzhangJie(html,setUpdatedChapters,DangqianYe,DangqianZhang)
        }else{
            let { translateX,pageHeight, translateY, shenti, columnGap, pageWidth } = YemaGengxin(epubfameDIV0, DangqianYe);
            if(Vertical){
                translateY += pageHeight*(-1);
                shenti.style.transform = `translateY(${translateY-columnGap+17}px)`;
            }else{
                translateX += pageWidth * (-1);
                shenti.style.transform = `translateX(${translateX-columnGap}px)`;
            }
        }
    }else{
        if (Vertical || epubfameDIV0.clientWidth < 768) {
            DangqianYe += -1;
        } else if (!Vertical && epubfameDIV0.clientWidth > 768) {
            DangqianYe += -2;
        }
        if (DangqianYe <1) {
            DangqianYe = 1;
            DangqianZhang += -1;
            if (DangqianZhang <1) {
                DangqianZhang = 1;
            }
            gengxzhangJie(html,setUpdatedChapters,DangqianYe,DangqianZhang)
        }else{
            let { translateX,pageHeight, translateY, shenti, columnGap, pageWidth } = YemaGengxin(epubfameDIV0, DangqianYe);
            if(Vertical){
                translateY += pageHeight;
                shenti.style.transform = `translateY(${translateY+columnGap-19}px)`;
            }else{
                translateX += pageWidth;
                shenti.style.transform = `translateX(${translateX+columnGap}px)`;
            }
        }
    }
}

function gengxzhangJie(html,setUpdatedChapters,DangqianYe,DangqianZhang){
    const allChapterDivs = document.querySelectorAll('div[id^="chapter_"]');
    const targetId = html[DangqianZhang - 1].split(/[\\/]/).pop();
    const epubfameDIV = document.getElementById(`chapter_${targetId}`);
    setUpdatedChapters({ allChapterDivs, epubfameDIV, targetId });
    document.getElementById('dqye').innerText=`${DangqianYe}`;
    return DangqianZhang;
}

function YemaGengxin(epubfameDIV0,DangqianYe){
    document.getElementById('dqye').innerText=`${DangqianYe}`;

    // 更新 iframe 的内容
    const columnGap = epubfameDIV0.clientWidth * 0.06;
    const targetIframe = epubfameDIV0.querySelector('iframe');
    const shenti = targetIframe.contentDocument.querySelector('body');
    const currentTransform = shenti.style.transform;
    let translateX = 0;
    let translateY=0;

    // 获取当前的 transform 属性，计算平移距离
    if (currentTransform && currentTransform.includes('translateX')) {
        translateX = Math.round(parseFloat(currentTransform.match(/translateX\((-?\d+(\.\d+)?)px\)/)[1]));
    }
    if (currentTransform && currentTransform.includes('translateY')) {
        translateY = Math.round(parseFloat(currentTransform.match(/translateY\((-?\d+(\.\d+)?)px\)/)[1]));
    }
    const pageWidth = targetIframe.contentWindow.innerWidth;
    const pageHeight = targetIframe.contentWindow.innerHeight;
    return {translateX,shenti,columnGap,pageWidth,translateY,pageHeight}
}
