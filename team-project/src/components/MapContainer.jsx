import React from 'react';

const MapContainer = ({ status, error, mapRef, activeTab, setActiveTab, handleMapClick }) => {

    const StatusOverlay = () => {
        if (status === 'ready') return null;

        let message = '';
        let className = 'status-overlay';
        switch (status) {
            case 'loading-key':
                message = 'API 키 로드 중...';
                break;
            case 'loading-script':
                message = '지도 데이터 로드 중...';
                break;
            case 'error':
                message = `오류: ${error}`;
                className += ' error';
                break;
            default:
                return null;
        }

        return (
            <div className={className}>
                {message}
            </div>
        );
    };

    return (
        <div className="map-container" onClick={handleMapClick}>
            <div className="map-tabs">
                <div className={`map-tab ${activeTab === '지도' ? 'active' : ''}`} onClick={() => setActiveTab('지도')}>지도</div>
                <div className={`map-tab ${activeTab === '위성' ? 'active' : ''}`} onClick={() => setActiveTab('위성')}>위성</div>
            </div>

            <div className="map-view-selection">View Selection Box</div>

            <StatusOverlay />

            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

            <div className="map-info-bottom-left">
                Maximum: 2000 events mapped.
            </div>
            <div className="map-info-bottom-right">
                Legend ▶
            </div>
        </div>
    );
};

export default MapContainer;
