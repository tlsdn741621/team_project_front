import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../util/axiosInstance';
import UserNav from "./UserNav";
import CoordinatePanel from "./CoordinatePanel"; // 방금 만든 컴포넌트 import

// --- 상태(Status) 정의 ---
const STATUS = {
    IDLE: 'idle',
    LOADING_KEY: 'loading-key',
    LOADING_SCRIPT: 'loading-script',
    READY: 'ready',
    ERROR: 'error',
};

/**
 * 구글 지도 API 키를 백엔드에서 가져와 지도를 표시하는 페이지 컴포넌트
 */
const ToolsPage = () => {
    const [status, setStatus] = useState(STATUS.IDLE);
    const [error, setError] = useState(null);
    const mapRef = useRef(null); // 지도가 렌더링될 DOM 요소를 참조
    const mapInstanceRef = useRef(null); // 지도 인스턴스를 저장
    const markerRef = useRef(null); // 마커 인스턴스를 저장

    // 마커의 위치를 저장하는 상태
    const [markerPosition, setMarkerPosition] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 패널 상태 추가

    // 예측 관련 상태 추가
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [predictionError, setPredictionError] = useState(null);

    // CoordinatePanel에서 전달된 새 좌표로 마커와 지도를 업데이트하는 함수
    const handlePositionChange = (newPosition) => {
        setMarkerPosition(newPosition);

        // 지도 중심 이동
        if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(newPosition);
        }

        // 마커 위치 업데이트 또는 생성
        if (markerRef.current) {
            markerRef.current.setPosition(newPosition);
        } else {
            if (mapInstanceRef.current && window.google) {
                markerRef.current = new window.google.maps.Marker({
                    position: newPosition,
                    map: mapInstanceRef.current,
                });
            }
        }
    };

    // 예측 실행 함수
    const handlePrediction = async (data) => {
        if (!data.lat || !data.lng) {
            setPredictionError("위치를 먼저 선택해주세요.");
            return;
        }

        setIsPredicting(true);
        setPredictionResult(null);
        setPredictionError(null);

        try {
            // 백엔드의 예측 API 엔드포인트로 요청합니다.
            // Spring Boot 컨트롤러가 /api/predict/tsunami 와 같은 경로를 가지도록 설정해야 합니다.
            const response = await axiosInstance.post('/predict/tsunami', {
                latitude: data.lat,
                longitude: data.lng,
                magnitude: data.magnitude,
                depth: data.depth,
            });

            // 백엔드에서 받은 예측 결과를 상태에 저장합니다.
            // 예: { "tsunamiProbability": 0.85 }
            setPredictionResult(`쓰나미 발생 확률: ${response.data.tsunamiProbability.toFixed(2)}%`);

        } catch (error) {
            console.error("예측 API 호출 실패:", error);
            const errorMessage = error.response?.data?.message || "예측 중 오류가 발생했습니다.";
            setPredictionError(errorMessage);
            setPredictionResult(null); // 오류 발생 시 이전 결과 제거
        } finally {
            setIsPredicting(false);
        }
    };

    useEffect(() => {
        // 이 Effect는 컴포넌트가 처음 마운트될 때 단 한 번만 실행되어야 합니다.
        // 따라서 의존성 배열을 빈 배열([])로 설정합니다.

        const fetchApiKeyAndLoadScript = async () => {
            setStatus(STATUS.LOADING_KEY);
            console.log('1. 백엔드에서 API 키 로드를 시작합니다.');

            try {
                const response = await axiosInstance.get('/config/google-key');
                if (response.data && response.data.key) {
                    console.log('2. API 키를 성공적으로 받았습니다.');
                    loadGoogleMapsScript(response.data.key);
                } else {
                    throw new Error('백엔드 응답에 유효한 API 키(key) 필드가 없습니다.');
                }
            } catch (err) {
                console.error('API 키 로드 중 오류 발생:', err);
                const errorMessage = err.response
                    ? `HTTP ${err.response.status} 오류. 로그인 상태와 백엔드 서버를 확인하세요.`
                    : err.message;
                setError(errorMessage);
                setStatus(STATUS.ERROR);
            }
        };

        const loadGoogleMapsScript = (apiKey) => {
            setStatus(STATUS.LOADING_SCRIPT);
            console.log('3. 구글 지도 스크립트 로드를 시작합니다.');

            if (window.google) {
                initializeMap();
                return;
            }

            window.initMap = () => {
                console.log('4. 구글 지도 스크립트 로드 완료. 지도 초기화를 시작합니다.');
                initializeMap();
            };

            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onerror = () => {
                setError('구글 지도 스크립트를 로드하지 못했습니다. API 키가 유효한지 확인하세요.');
                setStatus(STATUS.ERROR);
                delete window.initMap;
            };

            document.head.appendChild(script);
        };

        const initializeMap = () => {
            if (!mapRef.current || !window.google) {
                console.error('지도 DOM 요소나 window.google 객체를 찾을 수 없습니다.', { hasMapRef: !!mapRef.current, hasWindowGoogle: !!window.google });
                setError('지도를 초기화하는 데 실패했습니다.');
                setStatus(STATUS.ERROR);
                return;
            }

            if (mapInstanceRef.current) return;

            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: 36.0, lng: 132.5 },
                zoom: 7,
            });

            // 지도 클릭 리스너 추가
            mapInstanceRef.current.addListener('click', (e) => {
                const latLng = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                };
                setMarkerPosition(latLng); // 마커 위치 상태 업데이트

                // 마커가 없으면 새로 생성, 있으면 위치 변경
                if (markerRef.current) {
                    markerRef.current.setPosition(latLng);
                } else {
                    markerRef.current = new window.google.maps.Marker({
                        position: latLng,
                        map: mapInstanceRef.current,
                    });
                }
            });

            console.log('5. 지도가 성공적으로 초기화되었습니다.');
            setStatus(STATUS.READY);
        };

        // 컴포넌트 마운트 시 API 로딩 시작
        fetchApiKeyAndLoadScript();

        // 클린업 함수: 컴포넌트가 언마운트될 때만 실행됩니다.
        return () => {
            const script = document.getElementById('google-maps-script');
            if (script) {
                script.remove();
            }
            if (window.initMap) {
                delete window.initMap;
            }
        };
    }, []); // <--- 의존성 배열을 비워서 마운트 시 한 번만 실행되도록 수정

    // 로딩 상태나 에러 메시지를 오버레이로 표시하는 컴포넌트
    const StatusOverlay = () => {
        if (status === STATUS.READY) return null;

        let message = '';
        switch (status) {
            case STATUS.LOADING_KEY:
                message = 'API 키 로드 중...';
                break;
            case STATUS.LOADING_SCRIPT:
                message = '지도 데이터 로드 중...';
                break;
            case STATUS.ERROR:
                message = `오류: ${error}`;
                break;
            default:
                return null;
        }

        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: status === STATUS.ERROR ? 'red' : 'black',
                zIndex: 10,
            }}>
                {message}
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <UserNav />
            <h1>Google 지도 연동 페이지</h1>

            {/* 좌표 확인 패널 토글 버튼 */}
            <button 
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    zIndex: 101, // 패널보다 위에 오도록 zIndex 조정
                    padding: '10px 20px',
                    backgroundColor: '#6a5acd',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                {isPanelOpen ? '시뮬레이션 닫기' : '시뮬레이션 열기'}
            </button>

            {/* 좌표 정보 패널 컴포넌트 사용 */}
            <CoordinatePanel 
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                position={markerPosition}
                onPositionChange={handlePositionChange}
                onPredict={handlePrediction}
                isPredicting={isPredicting}
                predictionResult={predictionResult}
                predictionError={predictionError}
            />

            <div style={{ 
                position: 'relative',
                width: '800px', 
                height: '600px', 
                border: '1px solid #ccc', 
                marginTop: '20px' 
            }}>
                <StatusOverlay />
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
};

export default ToolsPage;