import { useState, useEffect } from "react";
import { lawyerAPI } from "../services/api";
import fifthStar from "../assets/fifthStar.png";
import backIcon from "../assets/backBlack.png";
import SkipPersonalization from "../component/SkipPersonalization";

export default function OverlayCourtJurisdiction({ selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    practiceHighCourt,
    setPracticeHighCourt,
    practiceSupremeCourt,
    setPracticeSupremeCourt,
    onBack,
    onClick,
    onSkip
}) {
    

    const [showPopup, setShowPopup] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [isProvinceOpen, setIsProvinceOpen] = useState(false);
    const [isDistrictOpen, setIsDistrictOpen] = useState(false);

    const handleNext = async () => {
        if (!selectedProvince || !selectedDistrict) return;

        try {
            await lawyerAPI.saveCourtJurisdiction({
                provinceId: selectedProvince,
                district: selectedDistrict,
                practiceHighCourt,
                practiceSupremeCourt
            });
            console.log("Court jurisdiction saved!");
            onClick();
        } catch (err) {
            console.error("Failed to save court jurisdiction:", err);
            alert("Failed to save court jurisdiction");
        }
    };


    // Fetch provinces on load
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const data = await lawyerAPI.getProvinces();
                console.log("Provinces loaded:", data);
                setProvinces(data || []);
            } catch (err) {
                console.error("Error fetching provinces:", err);
                setProvinces([]);
            }
        };
        loadProvinces();
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
        if (!selectedProvince) {
            setDistricts([]);
            return;
        }

        const loadDistricts = async () => {
            try {
                console.log("Fetching districts for province id:", selectedProvince);
                const data = await lawyerAPI.getDistricts(selectedProvince);  // ✔ FIXED HERE
                console.log("Districts received:", data);
                setDistricts(data || []);
            } catch (err) {
                console.error("Error fetching districts:", err);
                setDistricts([]);
            }
        };

        loadDistricts();
    }, [selectedProvince]);


    const handleProvinceSelect = (province) => {
        // store id as string for consistent comparison in UI
        setSelectedProvince(String(province.province_id));
        setSelectedDistrict("");
        setIsProvinceOpen(false);
        console.log("Province selected:", province);
    };

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district.district_name);
        setIsDistrictOpen(false);
        console.log("District selected:", district);
    };

    const getSelectedProvinceName = () => {
        // compare string ids to avoid type mismatch
        const province = provinces.find(p => String(p.province_id) === selectedProvince);
        return province ? province.province_name : "";
    };

    // improved click-outside handler (targets both dropdown wrappers)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !event.target.closest(".province-dropdown") &&
                !event.target.closest(".district-dropdown")
            ) {
                setIsProvinceOpen(false);
                setIsDistrictOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-120 h-120 p-13 pb-6 bg-white rounded-[15px] shadow-lg flex flex-col items-center">

            {/* Back + Stars */}
            <div className="flex items-center w-full mb-4">
                <img
                    src={backIcon}
                    alt="back"
                    className="cursor-pointer"
                    style={{ width: "20px", height: "20px" }}
                    onClick={onBack}
                />

                <div className="flex-1 flex justify-center">
                    <img src={fifthStar} alt="stars" style={{ width: "200px" }} />
                </div>
            </div>

            {/* Title */}
            <p className="text-[20px] text-gray-900 font-semibold mt-3">
                Select your court jurisdiction
            </p>
            <p className="mt-2 text-[13px] text-gray-600 text-center">
                Tell us where you mainly practice.
                This helps NYAYAMITRA personalize your dashboard with court updates
                & case-related information.
            </p>

            {/* Province Dropdown */}
            <div className="w-full mt-3 px-6">
                <div className="relative province-dropdown">
                    <button
                        type="button"
                        onClick={() => setIsProvinceOpen(!isProvinceOpen)}
                        className="w-full px-4 py-2 border border-gray-900 rounded bg-white text-left flex items-center justify-between"
                        style={{
                            borderRadius: "10px",
                            fontSize: "14px",
                            height: "42px",
                            color: selectedProvince ? "#111827" : "#4C4B4B",
                        }}
                    >
                        <span className="font-normal">
                            {getSelectedProvinceName() || "Select Province"}
                        </span>

                        <svg
                            className={`w-5 h-5 transition-transform ${isProvinceOpen ? "rotate-180" : ""}`}
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

                    {isProvinceOpen && (
                        <div
                            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto"
                            style={{ borderRadius: "10px" }}
                        >
                            {provinces.length === 0 && (
                                <div className="px-4 py-2 text-sm text-gray-500">No provinces</div>
                            )}
                            {provinces.map((p) => (
                                <div
                                    key={p.province_id}
                                    onClick={() => handleProvinceSelect(p)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    style={{ fontSize: "14px", color: "#4C4B4B" }}
                                >
                                    {p.province_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* District Dropdown */}
            <div className="w-full mt-4 px-6">
                <div className="relative district-dropdown">
                    <button
                        type="button"
                        onClick={() => {
                            // toggles only if a province is selected
                            if (selectedProvince) {
                                setIsDistrictOpen(!isDistrictOpen);
                            } else {
                                // helpful debug message if user tries without selecting province
                                console.log("Please select a province first");
                            }
                        }}
                        disabled={!selectedProvince}
                        className="w-full px-4 py-2 border border-gray-900 rounded bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            borderRadius: "10px",
                            fontSize: "14px",
                            height: "42px",
                            color: selectedDistrict ? "#111827" : "#4C4B4B",
                        }}
                    >
                        <span className="font-normal">
                            {selectedDistrict || "Select District"}
                        </span>

                        <svg
                            className={`w-5 h-5 transition-transform ${isDistrictOpen ? "rotate-180" : ""}`}
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

                    {isDistrictOpen && districts.length > 0 && (
                        <div
                            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto"
                            style={{ borderRadius: "10px" }}
                        >
                            {districts.map((d) => (
                                <div
                                    key={d.id}
                                    onClick={() => handleDistrictSelect(d)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    style={{ fontSize: "14px", color: "#4C4B4B" }}
                                >
                                    {d.district_name}
                                </div>
                            ))}
                        </div>
                    )}

                    {isDistrictOpen && districts.length === 0 && (
                        <div
                            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg p-4"
                            style={{ borderRadius: "10px" }}
                        >
                            <p className="text-sm text-gray-500">Loading districts...</p>
                        </div>
                    )}
                </div>
            </div>


            {/* High Court Practice Checkbox */}
            <div className="w-full mt-3 px-6 flex justify-center">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={practiceHighCourt}
                        onChange={(e) => setPracticeHighCourt(e.target.checked)}
                    />
                    <span className="text-[14px] text-gray-700">
                        Do you also practice in High Court?
                    </span>
                </label>
            </div>

            {/* Supreme Court Practice Checkbox */}
            <div className="w-full mt-2 px-6 flex justify-center">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={practiceSupremeCourt}
                        onChange={(e) => setPracticeSupremeCourt(e.target.checked)}
                    />
                    <span className="text-[14px] text-gray-700">
                        Do you also practice in Supreme Court?
                    </span>
                </label>
            </div>


            {/* Spacer */}
            <div className="flex-1" />

            {/* Next */}
            <button
                className="w-90 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                style={{ borderRadius: "10px", padding: "5px", fontSize: "15px" }}
                disabled={!selectedProvince || !selectedDistrict}
                onClick={handleNext}
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
                onMouseDown={(e) => e.preventDefault()}
            >
                Skip personalization
            </button>

            {/* Popup */}
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
