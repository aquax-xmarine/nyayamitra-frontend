import React from "react";
import backgroundImage from "../assets/login-signup.jpg";
import logo from "../assets/logo.png";
import back_button from "../assets/back.png";
import SignUpCard from "../component/SignupBox";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-blue-600 overflow-hidden">

      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: "center 10%" }}
      ></div>

      {/* Background opacity overlay */}
      <div className="absolute inset-0 bg-white opacity-30"></div>


      {/* Left Container */}
      <div className="sm:w-1/12 md:w-1/3 lg:w-1/2  xl:w-4/7 flex flex-col relative">

        {/* Navbar */}
        <nav className="flex items-center justify-between pt-10 w-[700px]">
          {/* Logo + Title */}
          <button className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => navigate("/")}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#A39E9E' }}
          >
            <img src={logo} alt="Logo" className="w-8 h-7 rounded-[7px] ml-8" />
            <p className=" text-[17px] font-medium"
            >NYAYAMITRA</p>
          </button>

          {/* Back to Website */}

          <button className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity z-30"
            onClick={() => navigate("/")}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#A39E9E' }}

          >
            <img src={back_button} alt="Back" className="w-4 h-4" />
            Back to Website
          </button>


        </nav>


        {/* Text Content */}
        <div className="pl-10 pb-0 absolute left-25 bottom-19 flex-1 flex flex-col sm:hidden md:block">
          <h1 className="text-4xl font-bold text-white mb-4"
            style={{ color: '#A39E9E' }}
          >
            Ask Clearly. Understand <br />Quickly. Act Confidently.
          </h1>
          <p className="text-sm text-white opacity-90"
            style={{ color: '#A39E9E' }}
          >
            Get reliable legal support anytime, anywhere - from simple <br />
            legal questions to in-depth case analysis.
          </p>
        </div>
      </div>


      {/* Right Container */}

      <div className="sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-3/7 relative h-screen flex items-center justify-center">

        <SignUpCard />

      </div>
    </div>
  );
};

export default SignUp;
