import { useState, useEffect } from "react";
import { lawyerAPI } from "../services/api";
import fourthStar from "../assets/fourthStar.png";
import backIcon from "../assets/backBlack.png";
import SkipPersonalization from "../component/SkipPersonalization";




export default function OverlayPracticeArea({ onBack, onClick, onSkip }) {
    const [practiceAreas, setPracticeAreas] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const handleNext = async () => {
        if (selectedAreas.length === 0) return;

        try {
            await lawyerAPI.savePracticeAreas(selectedAreas);
            console.log("Practice areas saved successfully!");
            onClick(selectedAreas); // move to next step
        } catch (err) {
            console.error("Failed to save practice areas:", err);
            alert("Failed to save practice areas");
        }
    };


    // Fetch practice areas on load
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const data = await lawyerAPI.getPracticeAreas();
                setPracticeAreas(data);
            } catch (err) {
                console.error("Error loading practice areas:", err);
            }
        };
        fetchAreas();
    }, []);

    // Select / Unselect toggle
    const toggleSelect = (areaName) => {
        setSelectedAreas((prev) =>
            prev.includes(areaName)
                ? prev.filter((a) => a !== areaName)
                : [...prev, areaName]
        );
    };

    return (
        <div className="w-120 h-120 p-13 pb-6 bg-white rounded-[15px] shadow-lg flex flex-col items-center">

            {/* Back + Stars */}
            <div className="flex items-center w-full mb-4">
                <img
                    src={backIcon}
                    alt="back"
                    className="cursor-pointer"
                    style={{ width: "22px", height: "22px" }}
                    onClick={onBack}
                />

                <div className="flex-1 flex justify-center">
                    <img
                        src={fourthStar}
                        alt="stars"
                        style={{ width: "200px", height: "auto" }}
                    />
                </div>
            </div>

            {/* Title */}
            <p className="text-[22px] text-gray-900 font-semibold mt-3">
                Select your practice area
            </p>
            <p className="mt-1 text-[14px] text-gray-600">
                Choose the areas of law you primarily work in.
            </p>

            {/* Practice Area Buttons */}
            <div
                className="flex flex-wrap ml-10 gap-3 mt-5 w-full overflow-y-auto"
                style={{ maxHeight: "250px" }}
            >
                {practiceAreas.map((area) => (
                    <button
                        key={area.area_id}
                        onClick={() => toggleSelect(area.area_name)}
                        style={{ borderRadius: "10px", fontSize: "10px" }}   // custom styles
                        className={`border rounded transition
        ${selectedAreas.includes(area.area_name)
                                ? "bg-gray-300 text-black border-black"
                                : "border-gray-400 text-gray-700"
                            }`}
                    >
                        {area.area_name}
                    </button>
                ))}
            </div>


            {/* Space filler */}
            <div className="flex-1" />

            {/* Next Button */}
            <button
                className="w-90 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: "10px", padding: "5px", fontSize: "15px" }}
                onClick={handleNext}
                disabled={selectedAreas.length === 0}
            >
                Next
            </button>

            {/* Skip */}
            <button
                className="w-90 mt-1 text-gray-600 underline hover:text-gray-800 transition-colors"
                style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "13px",
                    padding: "4px 0",
                    cursor: "pointer",
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
