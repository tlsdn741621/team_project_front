import React from 'react';

/**
 * 선택된 위치의 좌표를 표시하는 사이드 패널 컴포넌트
 * @param {object} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 패널의 열림/닫힘 상태
 * @param {function} props.onClose - 패널을 닫는 함수
 * @param {object | null} props.position - 위도(lat)와 경도(lng)를 포함하는 객체
 */
const CoordinatePanel = ({ isOpen, onClose, position }) => {
    if (!isOpen) {
        return null;
    }

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
        </div>
    );
};

export default CoordinatePanel;
