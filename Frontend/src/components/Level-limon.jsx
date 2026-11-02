import React from "react";
import "./Level-limon.css";
import packagePhoto from "../assets/packagePhoto.png"; // Package image

export default function Level({ level, color, packagePosition }) {
  const sectionCount = level.sections.length; 
  const fullWidth = sectionCount * 99; 
  const inlayWidth = 0.90 * 95; 

  return (
    <div className="fullshape" style={{ width: `${fullWidth}px`, backgroundColor: color }}>
      {level.sections.map((section, index) => {
        // We convert the array index (to a section number to match packagePosition.
        const showPackage = packagePosition === index + 1;

        return (
          <React.Fragment key={section.id}>
            <div className="inlay" style={{ width: `${inlayWidth}px` }}>
              {/* Show image */}
              {showPackage && (
                <img
                  src={packagePhoto}
                  alt="P"
                  className="packageImg"
                />
              )}
            </div>
            {index < level.sections.length - 1 && (
              <div className="divider" style={{ backgroundColor: color }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
