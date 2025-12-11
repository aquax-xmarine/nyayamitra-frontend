import ProfileAvatar from "../component/ProfileAvatar";
import { useAuth } from "../context/AuthContext";
import firstStar from "../assets/firstStar.png";
import editIcon from "../assets/editNameIcon.png";

import SkipPersonalization from "../component/SkipPersonalization";
import EditNamePopup from "../component/EditNamePopup";
import { useState } from "react";



export default function OverlayName({ onClick }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const { user } = useAuth();

  // Extract username before @
  const username = user?.email?.split("@")[0];

  return (
    <div className="w-120 h-120 p-13 bg-white rounded-[15px] shadow-lg flex flex-col items-center">

      {/*Six Stars Image */}
      <img
        src={firstStar}  // <-- change this path to your actual star image
        alt="stars"
        className="mb-4"
        style={{ width: "200px", height: "auto" }}
      />


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
            {username || "User"}!
          </span>

          <img
            src={editIcon}
            alt="edit"
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShowEditPopup(true)}
          />
        </div>
      </div>


      <p className="mt-5 text-[14px] text-gray-600 text-center">
        We’ll ask a few quick questions<br />
        to personalize your NYAYAMITRA<br />
        experience.
      </p>

      <button
        className="w-90 mt-6 px-4 py-2 bg-black text-white rounded"
        style={{ borderRadius: "15px", padding: '5px', fontSize: "15px" }}
        onClick={onClick}
      >
        Next
      </button>

      {/* Skip button */}
      <button
        className="w-90 mt-1 text-gray-600 underline"
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
          onConfirm={() => {
            setShowPopup(false);
            onClick();
          }}
        />
      )}

      {/* POPUP EDIT NAME */}
      {showEditPopup && (
        <EditNamePopup
          currentName={username}
          onClose={() => setShowEditPopup(false)}
          onSave={(newName) => {
            console.log("New Name:", newName);
            setShowEditPopup(false);
          }}
        />
      )}

    </div>
  );
}
