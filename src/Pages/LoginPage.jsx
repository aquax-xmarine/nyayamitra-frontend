import React from "react";
import backgroundImage from "../assets/login-signup.jpg";
import logo from "../assets/logo.png";

const Login = () => {
    return (
        <div className="w-screen h-screen relative bg-white">
            {/* Navbar */}
            <nav className="w-full absolute top-7 left-0 flex justify-between items-center z-10 pb-1.5 pt-1.5">

                {/* Logo + Title */}
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-8 h-7 rounded-[7px] ml-8" />
                    <p className="text-black text-[17px] font-medium">NYAYAMITRA</p>
                </div>

                <div>
                    <p className="text-black text-[13px] font-normal mr-125">Back to Website</p>
                </div>
            </nav>


            {/* Background image */}
            <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: "center 10%" }}
            ></div>

            {/* Background opacity overlay */}
            <div className="absolute inset-0 bg-white opacity-30"></div>



            {/* Text container */}
            <div className="absolute left-20 bottom-20 max-w-[800px]">

                <p className="text-gray-750 text-[45px] font-normal">
                    Ask Clearly. Understand <br />Quickly. Act Confidently.
                </p>

                <p className="text-black text-[13px] font-normal">
                    Get reliable legal support anytime, anywhere - from simple
                    legal questions to in-depth case analysis.
                </p>

            </div>


            {/*Form submission container*/}
            <div className="absolute right-20 top-7 bottom-7 w-[400px] h-[540px] z-50 bg-white bg-opacity-90 p-8 rounded-[20px] shadow-lg">
            </div>
        </div>
    );
};

export default Login;
