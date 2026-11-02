
import logo from '../assets/Sioux-logo.png';
import HRManager from './admin-manage.jsx'
import './admin-selection.css'
import { Link } from "react-router-dom";
import arrow from "../assets/arrow.png";
import packagepng from '../assets/package.png';
import printer from "../assets/printer.png"
import authorization from "../assets/authorization.png"
import Customfooter from '../components/Footer.jsx';
import Header from '../components/Header.jsx';


function Admin_selection() {
return (
    <>
    <div className='Background'>
        <Header />
        <div className='blueBar'/>
        <div className='main'>
            <div className='selection-container'>
                
                <div className='selection'>
                    <div className='selection-titel'>Assign receptionists roles</div>
                    <div className='accountCreation-background'>
                        <img src={authorization} className='selection-image'></img>
                    </div>
                    <div className='selection-footer'>
                        <Link className='link' to='/Admin'>Create users and give permissions</Link>
                        <img src={arrow} className='selection-image-arrow'></img>
                    </div>
                    <div className='selection-bar'></div>
                </div>

                <div className='selection'>
                    <div className='selection-titel'>View and manage inventory</div>
                    <div className='view-background'>
                        <img src={packagepng} className='selection-image'></img>
                    </div>
                    <div className='selection-footer'>
                        <Link className='link' to='/Admin/Manage/'>View inventory and manage shelves</Link>
                        <img src={arrow} className='selection-image-arrow'></img>
                    </div>
                    <div className='selection-bar'></div>
                </div>

                <div className='selection'>
                    <div className='selection-titel'>Print QR-codes</div>
                    <div className='print-background'>
                        <img src={printer} className='selection-image'></img>
                    </div>
                    <div className='selection-footer'>
                        <Link className='link' to='/Admin/Print'>Get section QR-codes for a building</Link>
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

export default Admin_selection