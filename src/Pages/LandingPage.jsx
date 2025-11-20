import React from "react";
import backgroundImage from "../assets/LandingPageImage.png";
import logo from "../assets/logo.png";

const App = () => {
  return (
    <div className="w-screen h-screen relative bg-white">

      {/* Navbar */}
      <nav className="w-full absolute top-0 left-0 flex justify-between items-center z-50 border border-gray-300 pb-1.5 pt-1.5">

        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-8 h-7 border border-black rounded-[7px] p-0.5 ml-8" />
          <p className="text-black text-[17px] font-medium">NYAYAMITRA</p>
        </div>


        {/* Log in + Sign up */}
        <div className="flex items-center gap-5 mr-8 text-[10px]">
          <button className="bg-white text-black font-normal">Log in</button>
          <button className=" bg-black text-white font-normal">
            Sign up for free
          </button>
        </div> 

      </nav>



      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>


      {/* Background opacity overlay */}
      <div className="absolute inset-0 bg-white opacity-20"></div>


      {/* Text container */}
      <div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 text-center max-w-[800px]">

        <p className="text-black text-[45px] font-normal">
          Welcome to NYAYAMITRA
        </p>

        <p className="text-black text-[13px] font-normal">
          NYAYAMITRA is your intelligent legal assistant designed to help you understand laws,
          research cases, and receive quick, reliable legal support anytime.
        </p>

      </div>

    </div>
  );
};

export default App;
