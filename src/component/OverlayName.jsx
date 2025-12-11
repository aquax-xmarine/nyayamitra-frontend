import ProfileAvatar from "../component/ProfileAvatar";
import firstStar from "../assets/firstStar.png";
import editIcon from "../assets/editNameIcon.png";

import SkipPersonalization from "../component/SkipPersonalization";
import EditNamePopup from "../component/EditNamePopup";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function OverlayName({ onClick, onSkip }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const { user, updateDisplayName } = useAuth();

  // Use name from user object, or fallback to email username
  const username = user?.name || user?.email?.split("@")[0] || "User";

  const handleSaveName = async (newName) => {
    try {
      await updateDisplayName(newName);
      console.log("Name saved successfully:", newName);
    } catch (error) {
      console.error("Failed to save name:", error);
      throw error; // Re-throw to let EditNamePopup handle it
    }
  };

  return (
    <div className="w-120 h-120 p-13 pb-6 bg-white rounded-[15px] shadow-lg flex flex-col items-center">
      {/* Back Button + Stars Row (matching OverlayLawyer structure) */}
      <div className="flex items-center w-full mb-4">
        
        {/* Invisible spacer to match back button width */}
        <div style={{ width: "20px", height: "20px" }}></div>

        {/* Center Stars */}
        <div className="flex-1 flex justify-center">
          <img
            src={firstStar}
            alt="stars"
            style={{ width: "200px", height: "auto" }}
          />
        </div>

      </div>

      {/* Profile Picture */}
      <ProfileAvatar size={80} />

      {/* Email */}
      <p className="mt-1 text-[15px] text-gray-600">
        {user?.email || "No email available"}
      </p>

      {/* Welcome Message */}
      <div className="mt-5 text-center">
        <p className="text-[20px] text-gray-900 font-semibold">
          Welcome to NYAYAMITRA,
        </p>

        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-[20px] text-gray-900 font-semibold">
            {username}!
          </span>

          <img
            src={editIcon}
            alt="edit"
            className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setShowEditPopup(true)}
          />
        </div>
      </div>

      <p className="mt-5 text-[14px] text-gray-600 text-center">
        We'll ask a few quick questions<br />
        to personalize your NYAYAMITRA<br />
        experience.
      </p>

      {/* Spacer to push buttons to bottom */}
      <div className="flex-1"></div>

      <button
        className="w-90 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        style={{ borderRadius: "10px", padding: '5px', fontSize: "15px" }}
        onClick={onClick}
      >
        Next
      </button>

      {/* Skip button */}
      <button
        className="w-90 mt-1 text-gray-600 underline hover:text-gray-800 transition-colors"
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

      {/* POPUP EDIT NAME */}
      {showEditPopup && (
        <EditNamePopup
          currentName={username}
          onClose={() => setShowEditPopup(false)}
          onSave={handleSaveName}
        />
      )}
    </div>
  );
}