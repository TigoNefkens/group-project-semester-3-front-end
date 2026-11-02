import React from "react";
import Level from "./Level-limon.jsx";
import "./Shelf-limon.css";


export default function Shelf({ shelf, packageCoordinates }) {
  const isThisShelf = packageCoordinates?.shelf === shelf.id
  const shelfColor = shelf.colour;
  

  return (
    <div className="levelcontainer">

      {shelf.levels.map((level) => {
        // Position of the package at this level, if applicable
        const packagePosition =
          isThisShelf && packageCoordinates?.level === level.id
            ? packageCoordinates.position
            : null;

        return (
          <Level
            key={level.id}
            level={level}
            color={shelfColor}
            packagePosition={packagePosition}
          />
          
        );
        
      })}
      <div className="shelfLabel" style={{color: "#656575"}}>Shelf {shelf.name}</div>
    </div>
    
  );
}
