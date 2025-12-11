import sizthStar from "../assets/sizthStar.png";
import backIcon from "../assets/backBlack.png";
import { useState } from "react";
import Confetti from "../assets/Confetti.gif";



export default function OverlayPersonalizationComplete({ onBack, onClick }) {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleLawyerChoice = (value) => {
        setSelectedOption(value);
    };

    return (
        <div className="w-120 h-120 p-13 pb-6 bg-white rounded-[15px] shadow-lg flex flex-col items-center">

            {/* Back Button + Stars Row */}
            <div className="flex items-center w-full mb-4">
                

                <div className="flex-1 flex justify-center">
                    <img src={sizthStar} alt="stars" style={{ width: "200px", height: "auto" }} />
                </div>
            </div>

            {/* Question Text */}
            <p className="text-[20px] text-gray-900 font-semibold mt-3">Personalization complete. </p>
            <p className="mt-2 text-[14px] text-gray-600 text-center">
                Your NYAYAMITRA workspace is now
                customized to  support your legal practice.
            </p>

            {/* Celebration GIF */}
            <div className="mt-4 flex justify-center">
                <img
                    src={Confetti}
                    alt="celebration"
                    className="w-32 h-32 object-contain"
                />
            </div>




            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Next Button */}
            <button
                className="w-90 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                style={{ borderRadius: "10px", padding: "5px", fontSize: "15px" }}

            >
                Continue to the Dashboard
            </button>

            {/* Skip button */}
            <button
                className="w-90 mt-1 text-gray-600  hover:text-gray-800 transition-colors"
                style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "13px",
                    padding: "4px 0",
                    cursor: "pointer"
                }}
                
            >
                {"\u200B"}
            </button>


        </div>
    );
}
