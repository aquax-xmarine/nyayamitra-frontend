import { useState } from "react";
import thirdStar from "../assets/thirdStar.png";
import backIcon from "../assets/backBlack.png";
import SkipPersonalization from "../component/SkipPersonalization";

export default function OverlayNBA({ onBack, onClick, onSkip }) {
    const [showPopup, setShowPopup] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState("");

    // Generate years from current year back to 1950
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setIsOpen(false);
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
                    <img
                        src={thirdStar}
                        alt="stars"
                        style={{ width: "200px", height: "auto" }}
                    />
                </div>
            </div>

            {/* Question Text */}
            <p className="text-[20px] text-gray-900 font-semibold mt-3">
                Enter your NBA number & license year
            </p>
            <p className="mt-2 text-[14px] text-gray-600">
                This helps us confirm that you are a licensed lawyer.
            </p>

            {/* NBA Number Input Row */}
            <div className="flex items-center gap-4 w-full max-w-md mt-13">
                <label className="text-[15px] text-gray-900 whitespace-nowrap" style={{ width: "110px" }}>
                    NBA number:
                </label>
                <input
                    type="text"
                    placeholder="Enter NBA number"
                    className=" flex-1 px-3 py-2 border border-gray-900 rounded focus:outline-none placeholder:text-[#4C4B4B] focus:border-gray-500"
                    style={{ borderRadius: "10px", fontSize: "15px", height: "42px" }}
                />
            </div>

            {/* License Year Dropdown Row */}
            <div className="flex items-center gap-4 w-full max-w-md mt-10">
                <label className="text-[15px] text-gray-900 whitespace-nowrap" style={{ width: "110px" }}>
                    License year:
                </label>
                <div className="flex-1 relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full px-3 py-2 border border-gray-900 rounded focus:outline-none focus:border-gray-500 bg-white text-left flex items-center justify-between"
                        style={{ borderRadius: "10px", fontSize: "15px", height: "42px", color: selectedYear ? "#111827" : "#4C4B4B" }}
                    >
                        <span style={{ marginLeft: "-20px", fontWeight: "400" }}>
                            {selectedYear || "Select year"}
                        </span>

                        <svg
                            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            style={{ marginRight: "-20px" }}
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="#6B7280"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M6 8l4 4 4-4"
                            />
                        </svg>
                    </button>

                    {isOpen && (
                        <div
                            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-34 overflow-y-auto"
                            style={{ borderRadius: "10px" }}
                        >
                            {years.map(year => (
                                <div
                                    key={year}
                                    onClick={() => handleYearSelect(year)}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    style={{ fontSize: "15px", color: "#4C4B4B" }}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer to push buttons to bottom */}
            <div className="flex-1"></div>

            <button
                className="w-90 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: "10px", padding: '5px', fontSize: "15px" }}
                onClick={onClick}
            >
                Next
            </button>

            {/* Skip button */}
            <button
                className="w-90 mt-1  text-gray-600 underline hover:text-gray-800 transition-colors"
                style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "13px",
                    padding: "4px 0",
                    cursor: "pointer"
                }}
                onClick={() => setShowPopup(true)}
                onMouseDown={e => e.preventDefault()}
            >
                Skip personalization
            </button>

            {/* POPUP SKIP PERSONALIZATION */}
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