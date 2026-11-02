import React, { useState, useEffect } from "react";
import "./Colour-dropdown.css"

function ColourDropdown({ selectedColour, setColour }) {
  const colors = [
    "#FFADAD","#FFD6A5","#FDFFB6","#CAFFBF","#9BF6FF","#A0C4FF",
    "#BDB2FF","#FFC6FF","#84E291","#F5A623","#50E3C2",
    "#CBA3E3","#A8D2C6","#E2C2B9","#B4E197","#FEC5BB","#D8E2DC",
    "#A1EAFB","#FFD1BA"
  ];

  const [Color, setColor] = useState(selectedColour || "#FFD6A5");

  useEffect(() => {
    if (selectedColour) setColor(selectedColour);
  }, [selectedColour]);

  const handleChange = (e) => {
    setColor(e.target.value);
    setColour(e.target.value);  
  };

  return (
    <div>
      <select
        value={Color}
        onChange={handleChange}
        style={{
          padding: "6px",
          borderRadius: "6px",
          width: "220px",
          backgroundColor: Color,
          color: "#000",
          fontWeight: "600",
        }}
        className="dropdownmenu"
      >
        {colors.map((c) => (
          <option key={c} value={c} style={{ backgroundColor: c }}>
          </option>
        ))}
      </select>
    </div>
  );
}

export default ColourDropdown;