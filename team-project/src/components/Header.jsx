import React from 'react';
import SAGE_LOGO_URL from '../image/img.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import UserNav from './UserNav.jsx';

const Header = () => {
    return (
        <div className="header-bar">
            <div className="header-left">
                <div className="logo-group">
                    <img src={SAGE_LOGO_URL} alt="SAGE Logo" />
                    <div>
                        <div className="logo-sage">Tsunami Prediction</div>
                        <div className="logo-subtitle">Prediction Service</div>
                    </div>
                </div>
            </div>
            <div className="header-right">
                <div className="header-contact-group">
                    <a href="#" onClick={() => window.location.reload()} style={{fontSize: '1.5em'}}>
                        <FontAwesomeIcon icon={faArrowsRotate} style={{marginRight: '5px'}} />
                        Refresh
                    </a>
                </div>
                <UserNav />
            </div>
        </div>
    );
};

export default Header;
