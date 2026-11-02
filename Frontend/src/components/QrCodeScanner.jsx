import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrCodeScanner({ onScan }) {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [scannedText, setScannedText] = useState(null);
  const [manualInput, setManualInput] = useState("");
  const readerId = "qr-reader";
  const scannerRef = useRef(null);

  // Load cameras
  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      setCameras(devices);
      if (devices.length > 0) setSelectedCamera(devices[0].id);
    });
  }, []);

  const startScanner = async () => {
    if (!selectedCamera) return;

    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
    }

    scannerRef.current = new Html5Qrcode(readerId);

    try {
      await scannerRef.current.start(
        selectedCamera,
        { fps: 20, qrbox: { width: 260, height: 260 } },
        (decoded) => {
          setScannedText(decoded);
          if (onScan) onScan(decoded);
        }
      );
    } catch (err) {
      console.error("Scanner failed to start:", err);
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [selectedCamera]);

  // Shared input/button style reset
  const noInteractiveBorder = {
    outline: "none",
    border: "none",
    boxShadow: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
        marginBottom:"10px"
      }}
    >
      <div
        style={{
          background: "#f0f0f0",
          padding: "30px",
          borderRadius: "10px",
          width: "380px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Camera selector */}
        {cameras.length > 0 && (
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "1px solid #888",
              background: "#e8e8e8",
              color: "#000",
            }}
            onFocus={(e) => Object.assign(e.target.style, noInteractiveBorder)}
            onBlur={(e) => (e.target.style.border = "1px solid #888")}
            onMouseOver={(e) => (e.target.style.border = "none")}
            onMouseOut={(e) => (e.target.style.border = "1px solid #888")}
            onMouseDown={(e) => (e.target.style.border = "none")}
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label || `Camera ${c.id}`}
              </option>
            ))}
          </select>
        )}

        {/* Scan area */}
        <div
          id={readerId}
          style={{
            width: "100%",
            height: "260px",
            background: "#d0d0d0",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        />

        {/* Scanned text — compact version */}
        {scannedText && (
          <div
            style={{
              background: "#fff",
              padding: "10px 12px",
              borderRadius: "10px",
              marginBottom: "18px",
              textAlign: "center",
              border: "1px solid #ccc",
            }}
          >
            <h4 style={{ margin: 0, color: "#000", fontSize: "16px" }}>
              Scanned:
            </h4>
            <p
              style={{
                fontSize: "15px",
                marginTop: "6px",
                color: "#333",
                wordBreak: "break-word",
              }}
            >
              {scannedText}
            </p>
          </div>
        )}

        {/* Manual input + confirm */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter code manually"
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "1px solid #888",
              color: "#000",
              background: "#e8e8e8",
            }}
            onFocus={(e) => Object.assign(e.target.style, noInteractiveBorder)}
            onBlur={(e) => (e.target.style.border = "1px solid #888")}
            onMouseOver={(e) => (e.target.style.border = "none")}
            onMouseOut={(e) => (e.target.style.border = "1px solid #888")}
            onMouseDown={(e) => (e.target.style.border = "none")}
          />

          <button
            onClick={() => onScan && onScan(manualInput)}
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              background: "#4a7afe",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onFocus={(e) => Object.assign(e.target.style, noInteractiveBorder)}
            onMouseOver={(e) => (e.target.style.border = "none")}
            onMouseOut={(e) => (e.target.style.border = "none")}
            onMouseDown={(e) => (e.target.style.border = "none")}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
