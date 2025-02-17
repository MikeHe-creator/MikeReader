"use client";
import '../globals.css';
import Link from "next/link";
import { useState, useEffect } from 'react';
import Bookself from "./components/Bookself";
import PDFcontent from "./components/pdfdeal/PDFcontent";
import PDFmenu from "./components/pdfdeal/PDFmenu";
import EPUBcontent from "./components/epubdeal/EPUBcontent";
import EPUBmenu from "./components/epubdeal/EPUBmenu";
import TXTcontent from "./components/textdeal/TXTcontent";
import ProfileLogin from "../components/ProfileLogin";

export default function Book(){
    const [bookSelfStore, setBookSelfStore] = useState([]);
    const [buttonClick, setButtonClick] = useState(null);
    const [jsonURLs, setJsonURLs] = useState([]);
    const [onSelect, setSelect] = useState(null);
    let [PDFsucai, setPDFsucai] = useState(null);
    let [PDFmuluscai, setPDFmuluscai] = useState(null);
    const [menuSendout,SetmenuSendout] = useState(null);
    let [EPUBmenusucai, setEPUBmuluscai] = useState(null);
    let [EPUBcontents, setEPUBcontents] = useState(null);
    let [TXTsucai, setTXTsucai] = useState(null);
    const [outhref,setOuthref]=useState(null);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        const caozuo = document.getElementById("caozuo");
        if (buttonClick !== null) {
            caozuo.style.display = "flex";
            const czJiemian=document.getElementById("czJiemian");
            Array.from(czJiemian.children).forEach(child => {
                if(child.id!=="close"){
                    child.style.display = "none";
                }
            });
            const activeChild = document.getElementById(buttonClick);
            console.log("activeChild",activeChild);
            activeChild.style.display = "flex";
        }
    }, [buttonClick]);

    function getfile(){
        const fs = document.createElement("input");
        fs.type = "file";
        fs.accept = ".pdf,.txt,.epub,.mobi";
        fs.onchange = () => {
            const gotfs = fs.files[0];
            setBookSelfStore(prevSelfStore => {
                if (!prevSelfStore.includes(gotfs.name)) {
                    return [...prevSelfStore, gotfs.name];
                }
                return prevSelfStore;
            });
            if (gotfs.type === "application/pdf") {
                jiexiPDF(gotfs,setJsonURLs);
            }else if(gotfs.type==="application/epub+zip"){
                jiexiEPUB(gotfs, setJsonURLs);
            }else if (gotfs.type === "text/plain") {
                jiexiTXT(gotfs, setJsonURLs);
            }
        };
        fs.click();
    }

    function jiexiPDF(gotfs,setJsonURLs){
        const pdfpass = new FormData();
        pdfpass.append("file", gotfs);
        fetch('http://localhost:8080/pdfpass', {
            method: 'POST',
            body: pdfpass
        })
            .then(response => response.json())
            .then(data => {
                console.log("data", data);
                const jsonPath = data.jsonPath;
                addjsonPath(jsonPath,setJsonURLs)
            })
            .catch(error => console.error('Error:', error));
    }

    function jiexiEPUB(gotfs,setJsonURLs){
        const epubPass=new FormData();
        epubPass.append("file", gotfs);
        fetch('http://localhost:8080/epubzip', {
            method: 'POST',
            body: epubPass
        })
           .then(response => response.json())
           .then(data => {
               console.log("data", data);
               const jsonPath = data.jsonPath;
               addjsonPath(jsonPath,setJsonURLs)
           })
    }

    function jiexiTXT(gotfs){
        let textFileName=gotfs.name
        setTXTsucai({ textwenben: gotfs, textfileName: textFileName });
    }

    const addjsonPath=(jsonPath,setJsonURLs)=>{
        const jsonURL = `http://localhost:8080${jsonPath}`;
        setJsonURLs(prevoutInfor => {
            if (!prevoutInfor.includes(jsonURL)) {
                return [...prevoutInfor, jsonURL];
            }
            return prevoutInfor;
        });
    }

    useEffect(() => {
        if (onSelect) {
            console.log("onSelect",onSelect)
            const { shujifile } = onSelect;
            console.log("shujifile",shujifile);
            const toggleServices = (pdfVisible, epubVisible, txtVisible) => {
                const pdfservices = document.getElementsByClassName("pdfservice");
                const epubservices = document.getElementsByClassName("epubservice");
                const txtservices = document.getElementsByClassName("textservice");
                Array.from(pdfservices).forEach(pdfservice => {
                    pdfservice.style.display = pdfVisible ? "flex" : "none";
                });
                Array.from(epubservices).forEach(epubservice => {
                    epubservice.style.display = epubVisible ? "flex" : "none";
                });
                Array.from(txtservices).forEach(txtservice => {
                    txtservice.style.display = txtVisible ? "flex" : "none";
                });
            };
            if (shujifile === ".pdf") {
                const { shujifile, bookname, pdfmenu, pdfleirong, width, height } = onSelect;
                toggleServices(true, false, false); // 显示 PDF 服务
                setPDFsucai({ shujifile, bookname, pdfmenu, pdfleirong, width, height });
                setPDFmuluscai({ bookname, pdfmenu });
            } else if (shujifile === ".epub") {
                const { bookname, html, css, toc, img } = onSelect;
                toggleServices(false, true, false); // 显示 EPUB 服务
                setEPUBmuluscai({ bookname, toc });
                setEPUBcontents({ bookname, html, css, img });
            } else if (shujifile === ".txt") {
                const {bookname} = onSelect;
                setTXTsucai({ textfileName: bookname });
                toggleServices(false, false, true); // 显示 TXT 服务
            }
        }
    }, [onSelect]);

    function UsersIn(){
        setShowProfile((prev) => !prev);
    }

    return (
        <>
            <div className={`absolute lg:w-1/4 w-full h-full bg-blue-100 z-[8] hidden`} id={"caozuo"}>
                <div className={'absolute w-[84%] h-full ml-[16%]'} id={"czJiemian"}>
                    <div className="mt-5 flex-col justify-center items-center hidden" id={"jumpcaozuo2"}>
                        <button><Link href={"/"} className={"text-[20px]"}>Home</Link></button>
                        <button className={"mt-2"}><Link href={"../Music"} className={"text-[20px]"}>Music</Link></button>
                        <button className={"mt-2"}><Link href={"../Video"} className={"text-[20px]"}>Video</Link></button>
                        {/*<button className={"mt-2"}><Link href={"../Collection"} className={"text-[20px]"}>Collection</Link></button>*/}
                    </div>
                    <div id={"bookshelf"}>
                        <Bookself bookSelfStore={bookSelfStore} jsonURLs={jsonURLs} setSelect={setSelect}/>
                    </div>
                    <div id={"bookmenu"}>
                        <div className={"pdfservice"}><PDFmenu PDFmuluscai={PDFmuluscai} SetmenuSendout={SetmenuSendout}/></div>
                        <div className={"epubservice"}><EPUBmenu EPUBmenusucai={EPUBmenusucai} setOuthref={setOuthref}/></div>
                    </div>
                    <div className={"absolute z-[9] bottom-2 w-full border-t-2 border-t-white"} id={"close"}>
                        <button className={"mt-2 ml-[45%] text-10"} onClick={() => {
                            document.getElementById("caozuo").style.display = "none";
                            setButtonClick(null);
                        }}>Close
                        </button>
                    </div>
                </div>
            </div>

            <div className={"absolute lg:w-[4%] w-[10%] mt-3 bg-blue-200 flex flex-col items-center opacity-50 rounded-r-2xl z-[10] lg:hidden"} id={"BeforeExpand"}>
                <img src={"/ico/expandToRight.svg"} alt={"功能键展开"} className={"w-10 h-10 mt-2 cursor-pointer"}
                     onClick={() => {
                         document.getElementById("BeforeExpand").style.display = "none";
                         document.getElementById("AfterExpand").style.display = "flex";
                     }}/>
            </div>
            <div className={"absolute lg:w-[4%] w-[10%] h-full bg-blue-200 lg:flex hidden flex-col items-center z-[9]"}
                 id={"AfterExpand"}>
                <div>
                    <img src={"/ico/expandToLeft.svg"} alt={"功能键隐藏"} className={"w-10 h-10 mt-3 cursor-pointer"}
                         onClick={() => {
                             document.getElementById("BeforeExpand").style.display = "block";
                             document.getElementById("AfterExpand").style.display = "none";
                             document.getElementById("caozuo").style.display = "none";
                             setButtonClick(null);
                         }}/>
                    <img src={"/ico/menu-reader.svg"} alt={"到其它部分"} className={"w-10 h-10 mt-3 cursor-pointer"}
                         onClick={() => setButtonClick("jumpcaozuo2")}/>
                    <img className={"w-10 h-10 mt-3 cursor-pointer"} src={"/ico/file2.svg"} alt={"获取文件"}
                         onClick={getfile}/>
                    <img src={"/ico/bookshelf.svg"} alt={"书架"} className={"w-10 h-10 mt-3 cursor-pointer"} onClick={() => setButtonClick("bookshelf")}/>
                    <img src={"/ico/menu.svg"} alt={"该书目录"} className={"w-10 h-10 mt-3 cursor-pointer"} onClick={() => setButtonClick("bookmenu")}/>
                </div>
                <div className={"absolute z-5 bottom-2"}>
                    <div>
                        <img src={"/ico/profile.svg"} alt={"用户中心"} className={"w-10 h-10 cursor-pointer"} onClick={UsersIn}/>
                    </div>
                    <div></div>
                </div>
            </div>
            <div id={"Bookcontent"} >
                <div className={"pdfservice hidden"} ><PDFcontent PDFsucai={PDFsucai} menuSendout={menuSendout}/></div>
                <div className={"epubservice hidden"}><EPUBcontent EPUBcontents={EPUBcontents} outhref={outhref}/></div>
                <div className={"textservice hidden"}><TXTcontent TXTsucai={TXTsucai}></TXTcontent></div>
            </div>
            <div className={`fixed inset-0 justify-center items-center h-screen z-[10] ${showProfile? "flex":"hidden"}`}>
                <ProfileLogin></ProfileLogin>
            </div>
        </>
    )
}