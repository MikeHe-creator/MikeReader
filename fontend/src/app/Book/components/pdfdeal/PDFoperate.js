export const PageScrolling=()=>{
    const pdfwenben=document.getElementById("pdfwenben");
    const currentPage=document.getElementById("currentPage");

    Array.from(pdfwenben.children).forEach((el)=>{
        if(el.style.display==="block"){
            for(let i=0; i<Array.from(el.children).length; i++){
                const rect=Array.from(el.children)[i].getBoundingClientRect();
                let firstimgId = null;
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    firstimgId = Array.from(el.children)[i].id;
                    let idNumber = null;
                    idNumber = firstimgId.match(/\d+/)[0];
                    if (idNumber) {
                        currentPage.innerHTML="";
                        currentPage.innerHTML = `${parseInt(idNumber)+1}`;
                    } else {
                        console.error("No canvas in view");
                    }
                    break;
                }
            }
        }
    })
}

export const NumToLocal = (inputValue) => {
    const pdfwenben=document.getElementById("pdfwenben");
    Array.from(pdfwenben.children).forEach((el)=>{
        if(el.style.display==="block"){
            const pdfwenben = document.getElementById("pdfwenben");
            const targetElement = document.getElementById(`page_${inputValue - 1}`); // 页码从1开始，因此要减去1
            if (targetElement) {
                console.log("targetElement",targetElement);
                const offsetTop = targetElement.offsetTop;
                pdfwenben.scrollTop = offsetTop - pdfwenben.offsetTop;
            } else {
                console.error("Target page not found");
            }
        }
    })
};

