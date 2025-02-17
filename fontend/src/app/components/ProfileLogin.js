import Denglu from "@/app/components/denglu";
import Zhuce from "@/app/components/zhuce";
import ReDopassword from "@/app/components/ReDopassword";
import {useState} from "react";

export default function (){
const [FanMmark,setFanMmark]=useState("Denglu");

    return(
        <>
            <div className="lg:w-[600px] lg:h-[300px] w-[350px] h-[240px] bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl shadow-2xl relative overflow-hidden">
                <div id={"mian1"} className={`${FanMmark==="Denglu"? "block":"hidden"}`}>
                    <Denglu setFanMmark={setFanMmark}/>
                </div>
                <div id={"mian2"} className={`${FanMmark==="Zhuce"? "block":"hidden"}`}>
                    <Zhuce setFanMmark={setFanMmark}/>
                </div>
                <div id={"mian3"} className={`${FanMmark==="ReDopassword"? "block":"hidden"}`}>
                    <ReDopassword setFanMmark={setFanMmark}/>
                </div>
            </div>
        </>
    )
}