import {useEffect, useState} from "react";
import {PageScrolling,NumToLocal} from "./PDFoperate";

export default function PDFcontent({ PDFsucai,menuSendout}) {
    const [totalpage, setTotalPage] = useState(0);
    const { bookname,pdfleirong, width, height } = PDFsucai || {};

    useEffect(() => {
        if(menuSendout){
            NumToLocal(menuSendout)
        }

        if (pdfleirong && width && height) {
            setTotalPage(pdfleirong.length);
            pdfpaths(pdfleirong, width, height, bookname);
        }

        const pdfwenben=document.getElementById("pdfwenben");
        Array.from(pdfwenben.children).forEach(wenben => {
            wenben.style.display = "none";
            const displayWenben = document.getElementById(`book_${bookname}.pdf`);
            if(displayWenben){displayWenben.style.display = "block";}
        })

        if(pdfwenben){
            pdfwenben.addEventListener("scroll", PageScrolling);
        }

    }, [bookname,pdfleirong, width, height,menuSendout]);

    function pdfpaths(pdfleirong, width, height, bookname) {
        const pdfwenben = document.getElementById("pdfwenben");
        const bookdiv = document.createElement('div');
        bookdiv.id = `book_${bookname}.pdf`;
        const existingBookDiv = document.getElementById(bookdiv.id);

        if(!existingBookDiv){
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const page = entry.target;
                        const pageIndex = page.getAttribute('data-page-index');
                        loadPage(pageIndex, pdfleirong[pageIndex], width, height, bookname);
                        observer.unobserve(page);
                    }
                });
            });

            for (let i = 0; i < pdfleirong.length; i++) {
                const pdfdiv = document.createElement('div');
                pdfdiv.id = `page_${i}`;
                pdfdiv.setAttribute('data-page-index', i);
                pdfdiv.style.display = 'flex';
                pdfdiv.style.justifyContent = 'center';
                pdfdiv.style.alignItems = 'center';
                pdfdiv.style.position = 'relative';
                pdfdiv.style.marginTop = '20px';
                pdfdiv.style.height = `${height * 0.5}px`;
                bookdiv.appendChild(pdfdiv);
                observer.observe(pdfdiv);
            }
            pdfwenben.appendChild(bookdiv);
        }
    }

    function loadPage(i, pdfPageUrl, width, height, bookname) {
        const pdfdiv = document.getElementById(`book_${bookname}.pdf`).querySelector(`#page_${i}`);
        const pdfcanvas = document.createElement('canvas');
        pdfcanvas.id = `canvas_${i}`;
        pdfcanvas.style.marginTop = '5px';
        pdfcanvas.style.border = "1px solid black";
        const pdfctx = pdfcanvas.getContext('2d');
        const pdfimg = new Image();
        pdfimg.src = `http://localhost:8080${pdfPageUrl}`;
        const pdfcanvas2 = document.createElement('canvas');
        pdfcanvas2.id = `canvas2_${i}`;
        pdfcanvas2.style.marginTop = '5px';
        pdfcanvas2.style.position = 'absolute';
        pdfcanvas2.style.pointerEvents = 'none';

        pdfimg.onload = function () {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const scale = Math.min(
                pdfdiv.clientWidth / width,
                pdfdiv.clientHeight / height,
                viewportWidth / width,
                viewportHeight / height
            );
            pdfcanvas.width = width * scale;
            pdfcanvas.height = height * scale;
            pdfcanvas2.width = pdfcanvas.width;
            pdfcanvas2.height = pdfcanvas.height;
            pdfdiv.style.height = `${pdfcanvas.height}px`;
            pdfctx.clearRect(0, 0, pdfcanvas.width, pdfcanvas.height);
            pdfctx.drawImage(pdfimg, 0, 0, pdfcanvas.width, pdfcanvas.height);
        };

        pdfdiv.appendChild(pdfcanvas);
        pdfdiv.appendChild(pdfcanvas2);
    }

    const changeNum = () => {
        const currentPage=document.getElementById("currentPage");
        currentPage.innerText=""
        const createP=document.createElement("input");
        createP.type="number";
        createP.value = currentPage.innerText;
        createP.style.width="50px"
        createP.onchange=(e)=>{
            const newPage = e.target.value;
            currentPage.innerText = newPage;
            NumToLocal(parseInt(newPage));
        }
        currentPage.appendChild(createP);
        createP.focus();
    };
    const thisbutton = (pumin) => {
        const currentPage = document.getElementById('currentPage');
        let newPageNumber;

        if (pumin === "plus" && parseInt(currentPage.innerText) < totalpage) {
            newPageNumber = parseInt(currentPage.innerText) + 1;
            currentPage.innerText = `${newPageNumber}`;
            NumToLocal(newPageNumber);
        } else if (pumin === "minus" && parseInt(currentPage.innerText) > 1) {
            newPageNumber = parseInt(currentPage.innerText) - 1;
            currentPage.innerText = `${newPageNumber}`;
            NumToLocal(newPageNumber);
        }
    };

    return (
        <>
            <div className="relative z-[6] h-[100vh] w-full flex justify-center">
                <div id="pdfwenben" className="relative w-full ml-[1%] h-[96.6%] overflow-y-auto mx-auto"></div>
                <div id="pdfYema" className="fixed bottom-0 w-full bg-blue-400 z-[0]" style={{transition: 'width 0.3s ease'}}>
                    <div className="flex justify-center items-center">
                        <button onClick={()=>thisbutton("minus")}>◀️</button>
                        <span onClick={changeNum} id={"currentPage"}>1</span>
                        <span>/</span>
                        <span>{totalpage}</span>
                        <button onClick={()=>thisbutton("plus")}>▶️</button>
                    </div>
                </div>
            </div>
        </>
    );
}