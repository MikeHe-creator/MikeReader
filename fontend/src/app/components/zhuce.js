import {useState} from "react";

export default function Zhuce({setFanMmark}) {
    const [shouldNext, setShouldNext] =useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isSamePasswordValid, setIsSamePasswordValid] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");

    const qiehuanXiayiye = () => {
        const isEmailValidNow = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValidNow = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password);
        const isSamePasswordValidNow = confirmPassword === password;
        if (!email || !password || !confirmPassword) {
            alert("Please fill in the required information!");
        } else if (!isEmailValidNow || !isPasswordValidNow || !isSamePasswordValidNow) {
            alert("Please provide the required information!");
        } else {
            setShouldNext(true);
            const usernameInput = document.getElementById("username");
            const userName = usernameInput.value;
            let UserData = { "userName":userName,"email":email, "password":password };
            fetch("http://localhost:5000/registerData", {
                method: "POST",
                body:UserData,
            }).then(res => res.json())
              .then(()=>{console.log("信息已经发出")})
        }
    };

    const jianchaEmail = (e) => {
        const value = e.target.value;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === "") {
            setIsEmailValid(true);
        } else if (!regex.test(value)) {
            setIsEmailValid(false);
        } else {
            setIsEmailValid(true);
        }
        setEmail(value);
    };

    const jianchaPassword = (e) => {
        const value = e.target.value;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        if (value === "") {
            setIsPasswordValid(true);
        } else if (!regex.test(value)) {
            setIsPasswordValid(false);
        } else {
            setIsPasswordValid(true);
        }
        setPassword(value);
    };

    const jianchaSame = (e) => {
        const value = e.target.value;
        setConfirmPassword(value); // 更新确认密码状态
        if (value === "") {
            setIsSamePasswordValid(true);
        } else if (value !== password) {
            setIsSamePasswordValid(false);
        } else {
            setIsSamePasswordValid(true);
        }
    };

    function backtoM(){
        setShouldNext(false);
    }

    return (
        <>
            <div>
                <div className="absolute inset-0 flex justify-center opacity-20 pointer-events-none">
                    <p className="lg:text-[80px] text-[40px] font-bold text-white transform lg:ml-64 ml-44">Welcome</p>
                </div>
                <div className={`flex flex-row relative z-5 lg:pt-12 pt-3`}>
                    <div>
                        <img alt={"用户头像2"} src={"chahua/user2.png"} className={'w-[180px] h-[180px] ml-[10px] rounded-2xl lg:block hidden'}/>
                    </div>
                    <div className={`${shouldNext? "hidden":"flex"}`}>
                        <div className={"flex flex-col pl-10"}>
                            <div>
                                <p className={"font-bold text-[20px] uppercase"}>User Registration Form</p>
                            </div>
                            <div className={"flex flex-col lg:pl-5 dengjixx"}>
                                <form className="flex flex-col justify-between">
                                    <div className="flex items-center pt-1">
                                        <span className="w-24">User Name:</span>
                                        <input type={"text"} className="flex-1 ml-4 p-[2px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" id={"username"}/>
                                    </div>
                                    <div className="flex items-center pt-1">
                                        <span className="w-24">Email:</span>
                                        <input type={"email"} className={`flex-1 ml-4 p-[2px] border rounded-md focus:outline-none focus:ring-2 ${isEmailValid ? "focus:ring-blue-500" : "focus:ring-red-500"}`} onChange={jianchaEmail}/>
                                    </div>
                                    <div className="flex items-center pt-1">
                                        <span className="w-24">Password:</span>
                                        <input type={"password"} className={`flex-1 ml-4 p-[2px] border rounded-md focus:outline-none focus:ring-2 ${isPasswordValid ? "focus:ring-blue-500" : "focus:ring-red-500"}`} onChange={jianchaPassword} id={"passwordUset"}/>
                                    </div>
                                    <div className="flex items-center pt-1">
                                        <span className="w-24">confirm:</span>
                                        <input type={"password"} className={`flex-1 ml-4 p-[2px] border rounded-md focus:outline-none focus:ring-2 ${isSamePasswordValid ? "focus:ring-blue-500" : "focus:ring-red-500"}`} onChange={jianchaSame}/>
                                    </div>
                                </form>
                            </div>
                            <div className={"mt-2 flex justify-center items-center"}>
                                <button className={"border-2 border-solid border-blue-600 rounded-2xl w-60 font-bold text-blue-800 text-[13px] uppercase"} onClick={qiehuanXiayiye}>confirmed and next</button>
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col ${shouldNext? "flex":"hidden"}`}>
                        <div className={`flex-row relative z-5 lg:pt-12 pt-3 `}>
                            <div className={`block`}>
                                <form>
                                    <div className="flex items-center pt-1 pl-5">
                                        <span className={"w-60"}>Write down the verification code you received in the email:</span>
                                    </div>
                                    <input type={"text"} className={"flex-1 ml-4 p-[2px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}/>
                                    <button className={"uppercase ml-6 border-2 border-solid border-blue-600 rounded-2xl w-24 font-bold text-blue-800 text-[13px]"}>Verify</button>
                                </form>
                            </div>
                            <div className={'hidden flex-col items-center pt-1 pl-8'}>
                                <span className={"text-center"}>Choose your photo as your profile picture:</span>
                                <input type={"file"} className={'mt-2 p-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500'}/>
                            </div>
                        </div>
                        <div className={"mt-2 flex justify-center items-center flex-row"}>
                            <button className={"border-2 border-solid border-blue-600 rounded-2xl w-36 font-bold text-blue-800 text-[13px] uppercase"} onClick={backtoM}>Back to modify</button>
                            <button className={"border-2 border-solid border-blue-600 rounded-2xl w-36 font-bold text-blue-800 text-[13px] uppercase ml-2"} >Finish and exit</button>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col justify-end items-end relative z-1 mt-2 lg:text-[14px] text-[12px]"}>
                    <button className={"font-bold "} onClick={()=>{setFanMmark("Denglu")}}>Had your account? Click here▶️</button>
                </div>
            </div>
        </>
    )
}
