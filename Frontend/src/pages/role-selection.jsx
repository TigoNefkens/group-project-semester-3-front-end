
import logo from '../assets/Sioux-logo.png';
import Customfooter from '../components/Footer.jsx';
import './role-selection.css'
import { Link } from "react-router-dom";
import adminpng from "../assets/admin.png"
import receptionistpng from "../assets/receptionist.png"
import headreceptionistpng from "../assets/head-receptionist.png"
import findpng from "../assets/search-mail.png"
import arrow from "../assets/arrow.png"
import Header from '../components/Header.jsx';


function role_selection() {
return (
    <>
    <div className='Background'>
        <Header />
        <div className='blueBar'/>
        <div className='main'>
            <div className='selection-container'>
                
                <div className='selection'>
                    <div className='selection-titel-roles'>Admin</div>
                    <div className='admin-background'>
                        <img src={adminpng} className='selection-image-admin'></img>
                    </div>
                    <div className='selection-footer-roles'>
                        <Link className='link' to='/Admin'>Manage Buildings/Shelves, print QR-codes and assign roles</Link>
                        <img src={arrow} className='selection-image-arrow'></img>
                    </div>
                    <div className='selection-bar'></div>
                </div>

                <div className='selection'>
                    <div className='selection-titel-roles'>Receptionist</div>
                    <div className='receptionist-background'>
                        <img src={receptionistpng} className='selection-image-receptionist'></img>
                    </div>
                    <div className='selection-footer-roles'>
                        <Link className='link' to='/Receptionist'>View the inventory, receive and hand out packages</Link>
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

export default role_selection