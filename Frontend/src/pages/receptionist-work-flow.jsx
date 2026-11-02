import { useState } from "react";
import logo from "../assets/Sioux-logo.png";
import Customfooter from "../components/Footer.jsx";
import QrScanner from "../components/QrCodeScanner.jsx";
import "./receptionist-work-flow.css";
import Header from '../components/Header.jsx';
import Modal from "../components/modal.jsx";
    
// import packageAPI from "../apis/PackageAPI.js";

// async function handleScan(decodedText) {
//   const success = await packageAPI.sendPackageVerificationEmail(decodedText);

//   if (success) {
//     console.log("Email successfully sent!");
//   } else {
//     console.log("Failed to send email.");
//   }
// }

export default function ReceptionistWorkflow() {
  const STEP = {
    SCAN_PACKAGE: 1,
    SHOW_PACKAGE: 2,
    SCAN_LOCATION: 3,
    CONFIRM_FULL: 4,
    COMPLETE: 5
  };

  const [step, setStep] = useState(STEP.SCAN_PACKAGE);
  const [packageInfo, setPackageInfo] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const reset = () => {
    setStep(STEP.SCAN_PACKAGE);
    setPackageInfo(null);
    setLocationInfo(null);
    setError("");
  };

  const handlePackageScanned = async (code) => {
    try {
      setError("");
      const res = await fetch(`http://localhost:8080/packages/verify?verification=${code}`);
      if (!res.ok) throw new Error("Package not found");
      const data = await res.json();
      setPackageInfo(data);
      setStep(STEP.SHOW_PACKAGE); 
    } catch (e) {
      setError(e.message);
    }
  };

  const handleLocationScanned = async (locCode) => {
    try {
      setError("");

      const [room, shelf, level, section] = locCode.split("-");
      const loc = { packageInformationId: +packageInfo.packageInformationId ,room: +room, shelf, level: +level, section: +section };

      const res = await fetch(
        `http://localhost:8080/packages/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loc),
        }
      );

      if (!res.ok) throw new Error("Failed to assign location");

      setLocationInfo(loc);
      setStep(STEP.CONFIRM_FULL);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleMarkFull = async (isFull) => {
    if(isFull)
      {
        const res = await fetch(
              `http://localhost:8080/Shelves/rooms/${locationInfo.room}/shelves/${locationInfo.shelf}/levels/${locationInfo.level}/sections/${locationInfo.section}?isFull=${isFull}`,
              { method: "PATCH" }
            );

            if (!res.ok) {
              alert("Failed to update section status");
              return;
            }
    }
    
    setStep(STEP.COMPLETE);
    setTimeout(() => reset(), 2000);
  };

  return (
    <div className="Background">
      <Header />

      <div className="blueBar" />

      <div className="main">
        <div className="scanner-container">

          {error && (
            <div style={{ color: "red", fontWeight: "bold", marginBottom: 12 }}>
              {error}
            </div>
          )}

          {step === STEP.SCAN_PACKAGE && (
            <>
              <h2 style={{marginLeft:"20%"}}>Scan Package Barcode</h2>
              
              <QrScanner onScan={handlePackageScanned} />
            </>
          )}

          {step === STEP.SHOW_PACKAGE && packageInfo && (
            <>
            <div style={{ color: "black"}}>
              <h2>Package Found</h2>
              <p><strong>Recipient:</strong> {packageInfo.recipientName}</p>
              <button onClick={() => setStep(STEP.SCAN_LOCATION)}>
                Place Package
              </button>
            </div>
            </>
          )}

          {step === STEP.SCAN_LOCATION && (
            <>
              <h2>Scan Location QR</h2>
              <QrScanner onScan={handleLocationScanned} />
            </>
          )}

          {step === STEP.CONFIRM_FULL && (
            <>
              <h2 style={{ color: "black"}}>Mark Section Full?</h2>
              <button onClick={() => handleMarkFull(true)}>Yes, Full</button>
              <button onClick={() => handleMarkFull(false)}>No, Space Left</button>
            </>
          )}

          {step === STEP.COMPLETE && (
            <h2>Package Stored Successfully</h2>
          )}
        </div>
      </div>

      <Customfooter />
    </div>
  );
}
