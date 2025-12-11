import { useState, useEffect } from "react";

import LoginNavbarAsk from '../component/NavBarProfileAsk';
import LoginNavbarIcon from '../component/NavBarProfileIcon';
import LoginNavbarProfile from '../component/NavBarProfileProfile';

import OverlayName from '../component/OverlayName';
import OverlayLawyer from '../component/OverlayLawyer';
import OverlayNBA from '../component/OverlayNBA';
import OverlayPracticeArea from '../component/OverlayPracticeArea';
import OverlayCourtJurisdiction from '../component/OverlayCourtJurisdiction';
import OverlayPersonalizationComplete from '../component/OverlayPersonalizationComplete';
import OverlayPersonalizationIncomplete from '../component/OverlayPersonalizationIncomplete';

const Onboarding = () => {

  // Load from localStorage or default to "name"
  const [overlay, setOverlay] = useState(
    localStorage.getItem("onboardingStep") || "name"
  );

  const disabled = true;

  // Save to localStorage whenever overlay changes
  useEffect(() => {
    localStorage.setItem("onboardingStep", overlay);
  }, [overlay]);

  return (
    <div className="relative flex h-screen">

      {/* MAIN CONTENT */}
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

      {disabled && (
        <div
          className="absolute inset-0 bg-gray-600 bg-opacity-25 pointer-events-none z-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        ></div>
      )}

      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">

          {overlay === "name" && (
            <OverlayName
              onClick={() => setOverlay("lawyer")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "lawyer" && (
            <OverlayLawyer
              onClick={() => setOverlay("NBA")}
              onBack={() => setOverlay("name")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "NBA" && (
            <OverlayNBA
              onClick={() => setOverlay("practiceArea")}
              onBack={() => setOverlay("lawyer")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "practiceArea" && (
            <OverlayPracticeArea
              onClick={() => setOverlay("courtJurisdiction")}
              onBack={() => setOverlay("NBA")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "courtJurisdiction" && (
            <OverlayCourtJurisdiction
              onClick={() => setOverlay("personalizationComplete")}
              onBack={() => setOverlay("practiceArea")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "personalizationComplete" && (
            <OverlayPersonalizationComplete />
          )}

          {overlay === "personalizationIncomplete" && (
            <OverlayPersonalizationIncomplete />
          )}

        </div>
      )}

    </div>
  );
};

export default Onboarding;
