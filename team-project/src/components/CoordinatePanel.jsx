import React, { useState, useEffect } from 'react';

/**
 * 선택된 위치의 좌표와 지진 규모를 입력받는 사이드 패널 컴포넌트
 * @param {object} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 패널의 열림/닫힘 상태
 * @param {function} props.onClose - 패널을 닫는 함수
 * @param {object | null} props.position - 위도(lat)와 경도(lng)를 포함하는 객체
 * @param {function} props.onPositionChange - 좌표를 수동으로 변경했을 때 호출되는 함수
 */
const CoordinatePanel = ({ isOpen, onClose, position, onPositionChange }) => {
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');
    const [magnitude, setMagnitude] = useState(3.0); // 지진 규모 상태 추가
    const [depth, setDepth] = useState(1); // 진앙 깊이 상태 추가

    // position prop이 변경될 때마다 수동 입력 필드를 업데이트합니다.
    useEffect(() => {
        if (position) {
            setManualLat(position.lat.toFixed(6));
            setManualLng(position.lng.toFixed(6));
        } else {
            setManualLat('');
            setManualLng('');
        }
    }, [position]);

    if (!isOpen) {
        return null;
    }

    const handleMove = () => {
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);
        if (!isNaN(lat) && !isNaN(lng)) {
            onPositionChange({ lat, lng });
        }
    };

    // 지진 규모 값이 범위 내에 있도록 보정하는 함수
    const handleMagnitudeChange = (e) => {
        let value = parseFloat(e.target.value);
        if (isNaN(value)) {
            setMagnitude('');
            return;
        }
        if (value < 3.0) value = 3.0;
        if (value > 9.5) value = 9.5;
        setMagnitude(value);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '130px',
            right: '20px',
            width: '300px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: 'white',
            zIndex: 100,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            maxHeight: 'calc(100vh - 150px)', // 패널 높이 제한
            overflowY: 'auto', // 내용이 길어지면 스크롤
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>선택된 위치 정보</h2>
                <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}>
                    &times;
                </button>
            </div>
            {position ? (
                <div>
                    <p style={{ marginTop: '10px' }}><strong>위도:</strong> {position.lat.toFixed(6)}</p>
                    <p style={{ marginTop: '10px' }}><strong>경도:</strong> {position.lng.toFixed(6)}</p>
                </div>
            ) : (
                <p style={{ marginTop: '10px', color: '#888' }}>지도를 클릭하여 위치를 선택하세요.</p>
            )}

            <hr style={{ margin: '20px 0' }} />

            <div>
                <h3>좌표로 이동</h3>
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="lat-input">위도:</label>
                    <input 
                        id="lat-input"
                        type="number"
                        value={manualLat}
                        onChange={(e) => setManualLat(e.target.value)}
                        style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="lng-input">경도:</label>
                    <input 
                        id="lng-input"
                        type="number"
                        value={manualLng}
                        onChange={(e) => setManualLng(e.target.value)}
                        style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                </div>
                <button 
                    onClick={handleMove}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        marginTop: '15px', 
                        backgroundColor: '#6a5acd', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}
                >
                    이동
                </button>
            </div>

            <hr style={{ margin: '20px 0' }} />

            <div>
                <h3>지진 규모 설정</h3>
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="magnitude-input">규모 (3.0 ~ 9.5):</label>
                    <input 
                        id="magnitude-input"
                        type="number"
                        value={magnitude}
                        onChange={handleMagnitudeChange}
                        min="3.0"
                        max="9.5"
                        step="0.1"
                        style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                </div>
            </div>

            <hr style={{ margin: '20px 0' }} />

            <div>
                <h3>진앙 깊이 설정</h3>
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="depth-input">깊이 (1 ~ 800 km):</label>
                    <input 
                        id="depth-input"
                        type="number"
                        value={depth}
                        onChange={(e) => {
                            let value = parseInt(e.target.value);
                            if (isNaN(value)) {
                                setDepth('');
                                return;
                            }
                            if (value < 1) value = 1;
                            if (value > 800) value = 800;
                            setDepth(value);
                        }}
                        min="1"
                        max="800"
                        step="1"
                        style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CoordinatePanel;
