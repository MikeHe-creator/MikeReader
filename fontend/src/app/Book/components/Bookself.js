import { useEffect } from 'react';

export default function Bookself({ bookSelfStore, jsonURLs,setSelect }) {
    useEffect(() => {
        const bkstore = document.querySelector('#bkstore');
        bkstore.innerHTML = '';

        for (let i = 0; i < bookSelfStore.length; i++) {
            const bkP = document.createElement('p');
            bkP.innerHTML = bookSelfStore[i];
            bkP.classList.add('Bookselected');
            bkP.style.cursor = 'pointer';
            bkP.style.fontSize = "18px";
            bkP.style.marginTop = "5px";
            bkP.addEventListener('mouseenter', () => {
                bkP.style.backgroundColor = "rgba(92,175,236,0.88)";
            });

            bkP.addEventListener('mouseleave', () => {
                bkP.style.backgroundColor = "";
            });

            // 添加点击事件
            bkP.addEventListener('click', (e) => {
                Array.from(bkstore.children).forEach(child => {
                    child.style.borderLeft = "";
                });
                const targetP = e.target;
                if (targetP.innerText.includes('.txt')) {
                    const shujifile = ".txt";
                    const bookname = targetP.innerText;
                    console.log("bookname", bookname);
                    setSelect({ shujifile, bookname });
                }
                const borderColor = flieColor(targetP);
                targetP.style.borderLeft = `2px solid ${borderColor}`;
                jiexipdfJSON(targetP,jsonURLs,setSelect);
            });
            if (i === bookSelfStore.length-1) {
                const borderColor = flieColor(bkP);
                bkP.style.borderLeft = `2px solid ${borderColor}`;
                const targetP=bkP
                jiexipdfJSON(targetP, jsonURLs,setSelect)

                if(bookSelfStore[i].includes('.txt')){
                    const shujifile = ".txt";
                    const bookname = bookSelfStore[bookSelfStore.length-1];
                    console.log("bookname", bookname);
                    setSelect({ shujifile, bookname });
                }
            }

            bkstore.appendChild(bkP);
        }
    }, [bookSelfStore,jsonURLs,setSelect]);

    function flieColor(targetP) {
        const filename = targetP.innerText;
        const filetype = filename.substring(filename.lastIndexOf('.'));
        if (filetype === ".pdf") {
            return "red";
        }else if (filetype === ".epub") {
            return "orange";
        }else if (filetype === ".txt") {
            return "gray"
        }
        return "";
    }

    function jiexipdfJSON(targetP, jsonURLs,setSelect) {
        const filename = targetP.innerText;
        const filename2 = filename.split(".")[0];
        const shujifile=filename.substring(filename.lastIndexOf('.'));
        const formattedFilename = filename2.replace(/[^\w\u4e00-\u9fa5\uAC00-\uD7AF\u3040-\u30FF\u0600-\u06FF\u0400-\u04FF]+/g, '_');
        //console.log("formattedFilename",formattedFilename);

        jsonURLs.forEach(jsonURL => {
            if (jsonURL.includes(formattedFilename)) {
                console.log(jsonURL);
                fetch(jsonURL)
                    .then(res => res.json())
                    .then(jsonData => {
                        if(shujifile === ".pdf"){
                            const bookname = jsonData.bookname;
                            const pdfmenu = jsonData.bookmarkInfo;
                            const pdfleirong = jsonData.imagePaths;
                            const width = jsonData.width;
                            const height = jsonData.height;
                            setSelect({ shujifile, bookname, pdfmenu, pdfleirong, width, height });
                        }else if(shujifile === ".epub") {
                            const bookname = filename;
                            const html = jsonData.htmlFiles;
                            const css = jsonData.cssFiles;
                            const toc = jsonData.toc;
                            const img = jsonData.imageFiles;
                            setSelect({shujifile, bookname, html, css, toc, img})
                        }
                    })
            }
        })
    }

    return (
        <>
            <div id="bkstore"></div>
        </>
    );
}