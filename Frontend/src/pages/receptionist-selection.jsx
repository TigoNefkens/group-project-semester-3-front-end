
import logo from '../assets/Sioux-logo.png';
import footer from '../assets/footer.png';
import './receptionist-selection.css'
import { Link } from "react-router-dom";
import scanpng from "../assets/barcode-scan.png"
import viewpng from "../assets/package.png"
import findpng from "../assets/search-mail.png"
import arrow from "../assets/arrow.png"
import Customfooter from '../components/Footer.jsx';
import Header from '../components/Header.jsx';


function receptionist_selection() {
return (
    <>
    <div className='Background'>
        <Header />
        <div className='blueBar'/>
        <div className='main'>
            <div className='selection-container'>
                
                <div className='selection'>
                    <div className='selection-titel'>Register incoming packages</div>
                    <div className='scan-background'>
                        <img src={scanpng} className='selection-image'></img>
                    </div>
                    <div className='selection-footer'>
                        <Link className='link' to='/Receptionist/Scanner'>Scan a package and link a location</Link>
                        <img src={arrow} className='selection-image-arrow'></img>
                    </div>
                    <div className='selection-bar'></div>
                </div>

                <div className='selection'>
                    <div className='selection-titel'>View all inventory</div>
                    <div className='view-background'>
                        <img src={viewpng} className='selection-image'></img>
                    </div>
                    <div className='selection-footer'>
                        <Link className='link' to='/Receptionist/InventoryQuantity'>View all inventories from all buildings</Link>
                        <img src={arrow} className='selection-image-arrow'></img>
                    </div>
                    <div className='selection-bar'></div>
                </div>

                <div className='selection'>
                    <div className='selection-titel'>Hand-out package</div>
                    <div className='find-background'>
                        <img src={findpng} className='selection-image'></img>
                    </div>
                    <div className='selection-footer'>
                        <Link className='link' to='/Receptionist/LocatePackage'>Scan QR-code and locate a package</Link>
                        <img src={arrow} className='selection-image-arrow'></img>
                    </div>
                    <div className='selection-bar'></div>
                </div>
               
            </div>
            
            
        </div>
        <Customfooter></Customfooter>
    </div>
    </>
)
}

export default receptionist_selection