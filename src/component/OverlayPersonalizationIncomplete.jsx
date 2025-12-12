import sizthStar from "../assets/sizthStar.png";
import backIcon from "../assets/backBlack.png";
import { useState, useEffect } from "react";
import Progress from "../assets/Progress.gif";
import percent from "../assets/40percent.png";

export default function OverlayPersonalizationIncomplete({onBack}) {
    const [showPercent, setShowPercent] = useState(false);

    // Run only once on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPercent(true);
        }, 1800); // 5 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-120 h-120 p-13 pb-6 bg-white rounded-[15px] shadow-lg flex flex-col items-center">
            <img
                src={backIcon}
                alt="back"
                className="cursor-pointer"
                style={{ width: "20px", height: "20px" }}
                onClick={onBack}
            />
            {/* Stars */}
            <div className="flex items-center w-full mb-4">
                <div className="flex-1 flex justify-center">
                    <img src={sizthStar} alt="stars" style={{ width: "200px", height: "auto" }} />
                </div>
            </div>

            {/* Title */}
            <p className="text-[20px] text-gray-900 font-semibold mt-3">
                You’ve skipped the personalization steps.
            </p>

            <div className="mt-10 mb-8"
                style={{
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",      // crop the image
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <img
                    src={showPercent ? percent : Progress}
                    alt="progress indicator"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"     // fill box perfectly
                    }}
                />
            </div>




            <p className="mt-2 text-[14px] text-gray-600 text-center">
                You’re almost there, you can complete the remaining in your profile page...
            </p>

            <div className="flex-1"></div>

            {/* Next Button */}
            <button
                className="w-90 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                style={{ borderRadius: "10px", padding: "5px", fontSize: "15px", fontWeight: 'normal' }}

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
