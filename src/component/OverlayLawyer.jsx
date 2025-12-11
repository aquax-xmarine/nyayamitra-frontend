import secondStar from "../assets/secondStar.png";
import backIcon from "../assets/backBlack.png";
import { useState } from "react";
import SkipPersonalization from "../component/SkipPersonalization";

export default function OverlayLawyer({ onBack, onClick, onSkip }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleLawyerChoice = (value) => {
    setSelectedOption(value);
  };

  return (
    <div className="w-120 h-120 p-13 pb-6 bg-white rounded-[15px] shadow-lg flex flex-col items-center">

      {/* Back Button + Stars Row */}
      <div className="flex items-center w-full mb-4">
        <img
          src={backIcon}
          alt="back"
          className="cursor-pointer"
          style={{ width: "20px", height: "20px" }}
          onClick={onBack}
        />

        <div className="flex-1 flex justify-center">
          <img src={secondStar} alt="stars" style={{ width: "200px", height: "auto" }} />
        </div>
      </div>

      {/* Question Text */}
      <p className="text-[20px] text-gray-900 font-semibold mt-3">Are you a lawyer?</p>
      <p className="mt-2 text-[14px] text-gray-600">Help us understand how you'll be using NYAYAMITRA</p>

      {/* Options */}
      <div className="mt-12 flex flex-col gap-10 w-full items-center">

        {/* YES Option */}
        <button
          className="w-90 px-6 py-3 rounded transition-colors"
          style={{
            borderRadius: "10px",
            fontSize: "15px",
            height: "50px",
            fontWeight: "normal",
            backgroundColor: selectedOption === true ? "#d1d5db" : "white", // grey when selected
            color: "black",
            border: "1px solid black"
          }}
          onClick={() => handleLawyerChoice(true)}
        >
          Yes, I am a licensed lawyer
        </button>

        {/* NO Option */}
        <button
          className="w-90 px-6 py-3 rounded transition-colors"
          style={{
            borderRadius: "10px",
            fontSize: "15px",
            height: "50px",
            fontWeight: "normal",
            backgroundColor: selectedOption === false ? "#d1d5db" : "white",
            color: "black",
            border: "1px solid black"
          }}
          onClick={() => handleLawyerChoice(false)}
        >
          No, I am not a licensed lawyer
        </button>

      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/*Next Button */}
      <button
        className="w-90 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors 
             disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ borderRadius: "10px", padding: "5px", fontSize: "15px" }}
        disabled={selectedOption === null}
        onClick={onClick}
      >
        Next
      </button>


      {/* Skip Button */}
      <button
        className="w-90 mt-1 text-gray-600 underline hover:text-gray-800 transition-colors"
        style={{ background: "transparent", border: "none", fontSize: "13px", padding: "4px 0", cursor: "pointer" }}
        onClick={() => setShowPopup(true)}
        onMouseDown={(e) => e.preventDefault()}
      >
        Skip personalization
      </button>

      {/* POPUP */}
      {showPopup && (
        <SkipPersonalization
          onClose={() => setShowPopup(false)}
          onSkip={() => {
            setShowPopup(false);
            onSkip();

          }}
        />
      )}
    </div>
  );
}
