import logo from '../assets/Sioux-logo.png';
import './receptionist-locate-package.css';
import Shelf from '../components/Shelf-limon.jsx';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import packageAPI from "../apis/PackageAPI.js";
import shelfAPI from "../apis/ShelfAPI.js";
import Customfooter from '../components/Footer.jsx';
import QrScanner from "../components/QrCodeScanner.jsx";
import MotionButton from "../components/MotionButton.jsx"
import Header from '../components/Header.jsx';

function App() {
  const navigate = useNavigate();

  const STEP = {
    SCAN_QR: 1,
    SHOW_PACKAGE_LOCATION: 2,
    SCAN_PACKAGE: 3,
    CONFIRM_NOT_FULL: 4,
    COMPLETE: 5
  };

  const [step, setStep] = useState(STEP.SCAN_QR);

  const [shelves, setShelves] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [packageCoordinates, setPackageCoordinates] = useState(null);
  const [visibleShelf, setVisibleShelf] = useState(null);

  const [expectedVerification, setExpectedVerification] = useState(null);
  const [feedback, setFeedback] = useState("");


  const normalizeShelves = (data) =>
  data.map((shelf, shelfIndex) => ({
    id: shelfIndex + 1,
    name: shelf.name,
    letter: shelf.letter,
    colour: shelf.colour || shelf.color,
    levels: shelf.levels.map((level, lvlIndex) => ({
      ...level,
      id: lvlIndex + 1
    }))
  }));

  useEffect(() => {
    const loadRooms = async () => {
      const roomList = await shelfAPI.getAllRooms();
      if (!selectedRoom && roomList.length > 0) {
        setSelectedRoom(roomList[0]);
      }};
      loadRooms();
    }, []);

  useEffect(() => {
    if (!selectedRoom) return;
    shelfAPI.getAllShelves(selectedRoom.id).then(data => {
      setShelves(normalizeShelves(data));
    });
  }, [selectedRoom]);

  const resetView = () => {
    setPackageCoordinates(null);
    setVisibleShelf(null);
  };


  const handleLocationScan = async (code) => {
    try {
      const loc = await packageAPI.getPackageLocationByVerification(code);

      if (!loc) {
        alert("Package not found");
        return resetView();
      }

      const roomList = await shelfAPI.getAllRooms();
      const matchedRoom = roomList.find(r => r.id === loc.room);

      let normalizedShelves = [];

      if (matchedRoom) {
        setSelectedRoom(matchedRoom);

        const shelvesData = await shelfAPI.getAllShelves(matchedRoom.id);
        normalizedShelves = normalizeShelves(shelvesData);
        setShelves(normalizedShelves);
      } else {
        alert("Room for this package not found");
        return;
      }

      const coords = getPackageCoordinates(loc, normalizedShelves);
      setPackageCoordinates(coords);
      setVisibleShelf(coords?.shelf);
      setExpectedVerification(code);
      setStep(STEP.SHOW_PACKAGE_LOCATION);

    } catch (e) {
      console.error(e);
      alert("Error searching package");
    }
  };

  const handlePackageScan = async (scannedCode) => {
    try {
      if (!packageCoordinates) {
        alert("No package selected");
        return;
      }

      // Check if scanned code matches the original verification code
      if (scannedCode.trim().toUpperCase() !== expectedVerification.trim().toUpperCase()) {
        alert("Scanned package does not match the expected package!");
        return;
      }

      // Update backend: mark package as Picked-up and stored = false
      await packageAPI.pickupPackage(scannedCode);

      alert("Package picked up successfully!");
      setStep(STEP.CONFIRM_NOT_FULL);

    } catch (e) {
      console.error(e);
      alert("Error scanning package");
    }
  };

  const goToScanPackageStep = () => setStep(STEP.SCAN_PACKAGE);

  const markSectionFull = async (Mark) => {
    
    if (Mark){
        const isFull = false;
        try {
        const loc = await packageAPI.getPackageLocationByVerification(expectedVerification);
        if (!loc) return;

        // Call backend
        await shelfAPI.updateSectionFullStatus(loc.room, loc.shelf, loc.level, loc.section, isFull);

        setFeedback(`Section marked as empty`);
        
        await packageAPI.deletePackageLocation(expectedVerification);

        resetView();
        setStep(STEP.COMPLETE);
      } catch (e) {
        console.error(e);
        setFeedback("Error updating section status");      
        setStep(STEP.COMPLETE);
      }
    }
    else{
      setFeedback("Section still marked as Full");     

      await packageAPI.deletePackageLocation(expectedVerification);

      setStep(STEP.COMPLETE);
    }
  };


  const getPackageCoordinates = (location, shelves) => {
    const shelfIndex = shelves.findIndex(s => s.letter === location.shelf);
    if (shelfIndex === -1) return null;

    const shelf = shelves[shelfIndex];

    const levelIndex = location.level -
      Math.min(...location.levels?.map(l => l.level) ?? [1]) + 1;

    return {
      room: location.room,
      shelf: shelf.id,
      level: location.level,
      position: location.section
    };
  };

  const visibleShelves = visibleShelf
    ? shelves.filter(s => s.id === visibleShelf)
    : shelves;

  return (
    <div className="Background">
      <Header />

      <div className="blueBar" />

      <div className="main">
          {step === STEP.SCAN_QR && (
            <div className='scanner-container'> 
              <div className='scan-qr'>
                <h2>Scan Employee QR Code</h2>
                <QrScanner onScan={handleLocationScan} />
              </div>
            </div>
          )}

          {step === STEP.SHOW_PACKAGE_LOCATION && (
            <>
              <div className="container">
                {selectedRoom && <div className="Manager-header">Current room : {selectedRoom.id}</div>}

                <div className="overlay">
                  {/* Shelves */}
                  <div className="ground">
                    {visibleShelves.map(shelf => (
                      <Shelf
                        key={shelf.id}
                        shelf={shelf}
                        packageCoordinates={packageCoordinates}
                      />
                    ))}

                    {/* Location info */}
                    <div className="package-location">                
                      <h2>Room: {packageCoordinates ? packageCoordinates.room : "N/A"}</h2>
                      <h2>Shelf: {packageCoordinates ? packageCoordinates.shelf : "N/A"}</h2>
                      <h2>Level: {packageCoordinates ? packageCoordinates.level : "N/A"}</h2>
                      <h2>Section: {packageCoordinates ? packageCoordinates.position : "N/A"}</h2>
                    </div>                  
                    <MotionButton onClick={goToScanPackageStep} style={{backgroundColor:"#FF7F00", padding:"15px", marginBottom:"20px"}}>Verify Package</MotionButton>
                  </div>
                </div>

                <div className="Manager-footer" style={{ color: "#EDEDED" }}>.</div>        
              </div>

            </>
          )}



          {step === STEP.SCAN_PACKAGE && (
            <div className='scanner-container'>
              <h2>Scan the package QR Code</h2>
              <QrScanner onScan={handlePackageScan} />
            </div>
          )}          
          
          {step === STEP.CONFIRM_NOT_FULL && packageCoordinates && (
            <div className="scanner-container">
              <div className='scan-qr' style={{ color: "black" }}>
                <h2>Mark section as Empty?</h2>
                <div>
                  <MotionButton 
                    onClick={() => markSectionFull(true)} 
                    style={{ backgroundColor: "#FF7F00", width: "100%"}}
                  >
                    Yes, Mark as Empty
                  </MotionButton>
                  <MotionButton 
                    onClick={() => markSectionFull(false)} 
                    style={{ backgroundColor: "#FF7F00", width: "100%" }}
                  >
                    No, do not Mark as Empty
                  </MotionButton>
                </div>
              </div>
            </div>
          )}

          {step === STEP.COMPLETE && (
            <>
              <div className="scanner-container">
                <div className='scan-qr' style={{ color: "black" }}>
                  <h2>{feedback}</h2>
                  <div>
                    <MotionButton 
                      onClick={() => window.location.reload()} 
                      style={{ backgroundColor: "#FF7F00", width: "100%"}}
                    >
                      Hand-out another Package
                    </MotionButton>
                    <MotionButton 
                      onClick={() => navigate("/Receptionist")} 
                      style={{ backgroundColor: "#FF7F00", width: "100%" }}
                    >
                      Go back to Homescreen
                    </MotionButton>
                  </div>
                </div>
              </div>
            </>
          )}

      </div>

      <Customfooter />
    </div>
  );
}

export default App;
