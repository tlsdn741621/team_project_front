import React from 'react';

const PageInfo = ({ historyLinkRef, handleShowHistory, setShowEarthquakeModal }) => {
    return (
        <div className="page-info-area">
            <div className="breadcrumbs">
                <a href="#data-services">DATA SERVICES</a>
            </div>
            <div className="page-title-row">
                <h1 className="page-title" style={{ fontSize: '2em' }}>지도</h1>
                <div className="wilber-support" onClick={() => setShowEarthquakeModal(true)}>임시 지진 발생</div>
            </div>
            <div className="page-description">
                <a href="#" ref={historyLinkRef} onClick={handleShowHistory}>기록</a>
            </div>
        </div>
    );
};

export default PageInfo;
