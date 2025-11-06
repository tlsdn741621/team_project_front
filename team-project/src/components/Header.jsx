import React from 'react';
import SAGE_LOGO_URL from '../image/img.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faPersonDrowning } from '@fortawesome/free-solid-svg-icons';
import UserNav from './UserNav.jsx';

const Header = () => {
    return (
        <div className="header-bar">
            <div className="header-left">
                <div className="logo-group">
                    <FontAwesomeIcon icon={faPersonDrowning} style={{marginRight: '10px', fontSize: '2em'}} />
                    <div>
                        <div className="logo-sage">쓰나미 예측 시뮬레이터</div>
                        <div className="logo-subtitle">Prediction Service</div>
                    </div>
                </div>
            </div>
            <div className="header-right">
                <div className="header-contact-group">
                    <a href="#" onClick={() => window.location.reload()} style={{fontSize: '1.5em'}}>
                        <FontAwesomeIcon icon={faArrowsRotate} style={{marginRight: '5px'}} />
                        새로고침
                    </a>
                </div>
                <UserNav />
            </div>
        </div>
    );
};

export { Header };
