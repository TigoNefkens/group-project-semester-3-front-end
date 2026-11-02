import React from "react";
import "./Level.css";

export default function Level({ level, color }) {
  const sectionCount = level.sections.length; 
  const fullWidth = sectionCount * 99;
  const inlayWidth = 0.90 * 95;

  return (
    <div className="fullshape" style={{ width: `${fullWidth}px`, backgroundColor: color}}>
      {level.sections.map((section, index) => (
        <React.Fragment key={section.id}>
          <div className="inlay" style={{ width: `${inlayWidth}px`,backgroundColor: section.isFull ? "#ff6961" : "white"}}>
          </div>
          {index < sectionCount - 1 && <div className="divider" style={{backgroundColor: color}} />}
        </React.Fragment>
      ))}
    </div>
  );
}