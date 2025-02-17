export default function Denglu ({setFanMmark}){
    return (
        <>
            <div>
                <div className="absolute inset-0 flex justify-center opacity-20 pointer-events-none">
                    <p className="lg:text-[80px] text-[40px] font-bold text-white transform lg:ml-64 ml-44">MikeReader</p>
                </div>
                <div className={"flex flex-row relative z-5 lg:pt-14 pt-3"}>
                    <div>
                        <img alt={"用户头像"} src={"chahua/user.png"} className={'w-[180px] h-[180px] ml-[10px] rounded-2xl lg:block hidden'}/>
                    </div>
                    <div className={"flex flex-col pl-10"}>
                        <div>
                            <p className={"font-bold text-[20px]"}>READER IDENTIFY CARD</p>
                        </div>
                        <div>
                            <form className="flex flex-col justify-between">
                                <div className="flex items-center pt-4">
                                    <span className="w-24">Email:</span>
                                    <input type="text" className="flex-1 ml-4 p-[2px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                </div>
                                <div className="flex items-center pt-4">
                                    <span className="w-24">Password:</span>
                                    <input type="password" className="flex-1 ml-4 p-[2px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                </div>
                            </form>
                        </div>
                        <div className={"mt-5 flex justify-center items-center"}>
                            <button className={"border-2 border-solid border-blue-600 rounded-2xl w-60 font-bold text-blue-800 text-[13px]"}>CLICK HERE TO CERTIFY</button>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
                </div>
                <div className={"flex flex-col justify-end items-end relative z-1 mt-2 lg:text-[14px] text-[12px]"}>
                    <button className={"font-bold "} onClick={()=>{setFanMmark("ReDoPassword")}}>Forgot your password? Click here▶️</button>
                    <button className={"font-bold "} onClick={()=>{setFanMmark("Zhuce")}}>Without the account? Click here▶️</button>
                </div>
            </div>
        </>
    )
}
