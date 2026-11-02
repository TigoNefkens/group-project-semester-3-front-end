import logo from '../assets/Sioux-logo.png';
import { useEffect, useState } from "react";
import './admin-print.css'
import Customfooter from '../components/Footer.jsx';
import QRCode from '../components/QR-Code.jsx';
import shelfAPI from "../apis/ShelfAPI.js";
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";
import MotionButton from "../components/MotionButton.jsx"
import { color } from 'framer-motion';
import Header from '../components/Header.jsx';


function adminPrint() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const result = await shelfAPI.getAllSections();

                if (!result || result.length === 0) {
                    setError("No sections found — unable to generate QR codes.");
                } else {
                    setLocations(result);
                }
            } catch (err) {
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const generatePDF = async () => {
        const doc = new jsPDF();
        
        const qrElements = document.querySelectorAll(".qr-image-export");

        const qrSize = 30;          
        const margin = 10;  
        const spacing = 10;

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const qrPerRow = Math.floor((pageWidth - margin * 5) / (qrSize + spacing));
        
        let x = margin;
        let y = margin;
        let count = 0;

        for (let i = 0; i < qrElements.length; i++) {
            const node = qrElements[i];

            const dataUrl = await htmlToImage.toPng(node);

            if (count > 0 && count % qrPerRow === 0) {
                x = margin;
                y += qrSize + spacing;
            }

            if (y + qrSize + margin > pageHeight) {
                doc.addPage();
                x = margin;
                y = margin;
            }

            doc.addImage(dataUrl, "PNG", x, y, qrSize, qrSize);

            x += qrSize + spacing;
            count++;
        }

        doc.save("qrcodes.pdf");
    };

    const createSectionId = (location) =>
        `${location.room}-${location.shelf}-${location.level}-${location.section}`;

    return (
        
        <>
        <div className='Background'>
            <Header />
            <div className='blueBar'/>
            <div className='main'>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="loading-message">Loading QR-codes...</div>
                )}

                {!loading && !error && (
                    <>
                        <div className='qrcode-container'>
                            {locations.map(loc => (
                                <div key={loc.id} className="qr-item">
                                    <QRCode sectionId={createSectionId(loc)} />
                                </div>
                            ))}
                        </div>
                        <MotionButton onClick={generatePDF} style={{backgroundColor:"#FF7F00"}}>Download PDF</MotionButton>
                    </>
                )}
            </div>
            <Customfooter></Customfooter>
        </div>
        </>
    )
}

export default adminPrint