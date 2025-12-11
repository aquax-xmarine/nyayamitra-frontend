import { useState } from "react";

import EditProfile from '../component/EditProfile';

import LoginNavbarAsk from '../component/NavBarProfileAsk';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';

import OverlayName from '../component/OverlayName';
import OverlayLawyer from '../component/OverlayLawyer';

const Onboarding = () => {
  const [overlay, setOverlay] = useState("name");
  const disabled = true; // toggle to disable/enable

  return (
    <div className="relative flex h-screen">

      {/* MAIN CONTENT (disabled except overlay) */}
      <div className={`${disabled ? "pointer-events-none opacity-50" : ""} flex w-full`}>
        <div className="w-15 py-3 border-r">
          <LoginNavbarIcon />
        </div>

        <div className="flex-1 py-4 h-full">
          <LoginNavbarAsk />
        </div>

        <div className="w-25 py-2">
          <LoginNavbarProfile />
        </div>
      </div>

      {/*Dim backgrouynd*/}
      {disabled && (
        <div
          className="absolute inset-0 bg-gray-600 bg-opacity-25 pointer-events-none z-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        ></div>
      )}

      {/* Overlay */}
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
          {overlay === "name" && (
            <OverlayName onClick={() => setOverlay("lawyer")} />
          )}

          {overlay === "lawyer" && (
            <OverlayLawyer />
          )}
        </div>
      )}

    </div>
  );
};

export default Onboarding;
