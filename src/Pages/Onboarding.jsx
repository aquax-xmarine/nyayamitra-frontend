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

  // LAWYER
  const [lawyerChoice, setLawyerChoice] = useState(
    JSON.parse(localStorage.getItem("lawyerChoice")) || null
  );
  useEffect(() => {
    localStorage.setItem("lawyerChoice", JSON.stringify(lawyerChoice));
  }, [lawyerChoice]);

  // NBA
  const [nbaNumber, setNbaNumber] = useState(
    localStorage.getItem("nbaNumber") || ""
  );
  const [licenseYear, setLicenseYear] = useState(
    localStorage.getItem("licenseYear") || ""
  );
  useEffect(() => {
    localStorage.setItem("nbaNumber", nbaNumber);
  }, [nbaNumber]);
  useEffect(() => {
    localStorage.setItem("licenseYear", licenseYear);
  }, [licenseYear]);

  // Practice Areas
  const [selectedAreas, setSelectedAreas] = useState(
    JSON.parse(localStorage.getItem("selectedAreas")) || []
  );
  useEffect(() => {
    localStorage.setItem("selectedAreas", JSON.stringify(selectedAreas));
  }, [selectedAreas]);

  // Court Jurisdiction
  const [selectedProvince, setSelectedProvince] = useState(
    localStorage.getItem("selectedProvince") || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    localStorage.getItem("selectedDistrict") || ""
  );
  const [practiceHighCourt, setPracticeHighCourt] = useState(
    JSON.parse(localStorage.getItem("practiceHighCourt")) || false
  );
  const [practiceSupremeCourt, setPracticeSupremeCourt] = useState(
    JSON.parse(localStorage.getItem("practiceSupremeCourt")) || false
  );
  useEffect(() => {
    localStorage.setItem("selectedProvince", selectedProvince);
  }, [selectedProvince]);
  useEffect(() => {
    localStorage.setItem("selectedDistrict", selectedDistrict);
  }, [selectedDistrict]);
  useEffect(() => {
    localStorage.setItem("practiceHighCourt", JSON.stringify(practiceHighCourt));
  }, [practiceHighCourt]);
  useEffect(() => {
    localStorage.setItem("practiceSupremeCourt", JSON.stringify(practiceSupremeCourt));
  }, [practiceSupremeCourt]);



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
              selectedOption={lawyerChoice}
              setSelectedOption={setLawyerChoice}
              onClick={() => setOverlay("NBA")}
              onBack={() => setOverlay("name")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "NBA" && (
            <OverlayNBA
              nbaNumber={nbaNumber}
              setNbaNumber={setNbaNumber}
              licenseYear={licenseYear}
              setLicenseYear={setLicenseYear}
              onClick={() => setOverlay("practiceArea")}
              onBack={() => setOverlay("lawyer")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "practiceArea" && (
            <OverlayPracticeArea
              selectedAreas={selectedAreas}
              setSelectedAreas={setSelectedAreas}
              onClick={() => setOverlay("courtJurisdiction")}
              onBack={() => setOverlay("NBA")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "courtJurisdiction" && (
            <OverlayCourtJurisdiction
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              practiceHighCourt={practiceHighCourt}
              setPracticeHighCourt={setPracticeHighCourt}
              practiceSupremeCourt={practiceSupremeCourt}
              setPracticeSupremeCourt={setPracticeSupremeCourt}
              onClick={() => setOverlay("personalizationComplete")}
              onBack={() => setOverlay("practiceArea")}
              onSkip={() => setOverlay("personalizationIncomplete")}
            />
          )}

          {overlay === "personalizationComplete" && (
            <OverlayPersonalizationComplete
              onBack={() => setOverlay("courtJurisdiction")}
            />
          )}

          {overlay === "personalizationIncomplete" && (
            <OverlayPersonalizationIncomplete
              onBack={() => setOverlay("courtJurisdiction")}
            />
          )}

        </div>
      )}

    </div>
  );
};

export default Onboarding;
