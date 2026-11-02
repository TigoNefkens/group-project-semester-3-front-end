import QRCode from "react-qr-code";

export default function QRcode({ sectionId }) {
  return (
    <div 
      className="qr-image-export"
      style={{
        background: "white",
        padding: 0,
        margin: 0,
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <div style={{ fontSize: "15px", marginBottom: "4px", color:"black", fontWeight:"bold" }}>
        {sectionId}
      </div>

      <QRCode
        value={sectionId}
        size={128}
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </div>
  );
}