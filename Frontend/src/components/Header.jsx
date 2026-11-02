import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Sioux-logo.png';
import BouncyButton from './MotionButton.jsx';
import './Header.css';
import backArrow from '../assets/back-better.png';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();


    const showBackButton = location.pathname !== '/';

    return (
        <div className='WebsiteHeader'>
            <div id='logoSection'>
                <img src={logo} alt="Sioux Logo" id='logo' />
            </div>
            
                {showBackButton && (
                    <div id='content-page-header' style={{width:"100%"}}>
                    <BouncyButton 
                        onClick={() => navigate(-1)}
                        className="header-back-button"
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '16px 24px',
                            fontSize: '14px',
                            marginRight: '15px',
                        }}
                    >
                        <img 
                            src={backArrow} 
                            alt="Volver" 
                            style={{
                                width: '100px',
                                height: '50px',
                                display: 'block'
                                
                            }}
                        />
                    </BouncyButton>
                    </div>
                )}
           

            {!showBackButton && (
                <div id='mottoSection' style={{marginLeft:"-3%", backgroundColor:"transparent", width:"100%"}}>
                    WE BRING&nbsp;<strong>HIGH-TECH</strong>&nbsp;TO LIFE
                </div>
            )}
            <div id='emptySection'></div>
        </div>
    );
}

export default Header;