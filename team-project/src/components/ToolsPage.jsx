import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../util/axiosInstance';
import './ToolsPage.css'; // 새로 작성할 CSS 파일 import


import Header from './Header.jsx';
import PageInfo from './PageInfo.jsx';
import MapContainer from './MapContainer.jsx';
import QueryPanel from './QueryPanel.jsx';
import HistoryPopover from './HistoryPopover.jsx';

// --- 상태(Status) 정의 ---
const STATUS = {
    IDLE: 'idle',
    LOADING_KEY: 'loading-key',
    LOADING_SCRIPT: 'loading-script',
    READY: 'ready',
    ERROR: 'error',
};

// const EARTHSCOPE_LOGO_URL = 'https://via.placeholder.com/30x30?text=ES';

/**
 * 최종 이미지와 동일한 UI를 구현하는 페이지 컴포넌트
 */
const ToolsPage = () => {
    const [status, setStatus] = useState(STATUS.IDLE);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    // --- Custom Query 패널 관련 상태 (이미지의 날짜로 초기화) ---
    const [markerPosition, setMarkerPosition] = useState(null);
    const [startDate, setStartDate] = useState('2025-10-06');
    const [endDate, setEndDate] = useState('2025-11-05');
    const [minMagnitude] = useState(3); // Magnutide와 Depth는 읽기 전용으로 설정
    const [maxMagnitude] = useState(10);
    const [minDepth] = useState(0.0);
    const [maxDepth] = useState(6371); // 지구 깊이 km

    // Location 필드 상태
    const [northCoord, setNorthCoord] = useState('');
    const [westCoord, setWestCoord] = useState('');
    const [eastCoord, setEastCoord] = useState('');
    const [southCoord, setSouthCoord] = useState('');

    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [predictionError, setPredictionError] = useState(null);
    const [activeTab, setActiveTab] = useState('지도');
    const [showHistoryPopover, setShowHistoryPopover] = useState(false);
    const [historyPopoverTarget, setHistoryPopoverTarget] = useState(null);
    const historyLinkRef = useRef(null);
    const [queryHistory, setQueryHistory] = useState([]);

    // 지도 클릭 시 마커 위치 업데이트
    const handleMapClick = (e) => {
        const latLng = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };
        setMarkerPosition(latLng);

        if (markerRef.current) {
            markerRef.current.setPosition(latLng);
        } else {
            if (mapInstanceRef.current && window.google) {
                markerRef.current = new window.google.maps.Marker({
                    position: latLng,
                    map: mapInstanceRef.current,
                });
            }
        }
        // Location 필드 업데이트
        setNorthCoord(latLng.lat.toFixed(4).toString());
        setSouthCoord(latLng.lat.toFixed(4).toString());
        setWestCoord(latLng.lng.toFixed(4).toString());
        setEastCoord(latLng.lng.toFixed(4).toString());
    };

    // 예측 실행 함수
    const handlePrediction = async (queryParams) => {
        if (!markerPosition || !markerPosition.lat || !markerPosition.lng) {
            setPredictionError("지도를 클릭하여 위치를 먼저 선택해주세요.");
            return;
        }

        setIsPredicting(true);
        setPredictionResult(null);
        setPredictionError(null);

        try {
            const response = await axiosInstance.post('/predict/tsunami', {
                latitude: markerPosition.lat,
                longitude: markerPosition.lng,
                magnitude: maxMagnitude,
                depth: maxDepth,
            });

            const result = `${response.data.tsunamiProbability.toFixed(2)}%`;
            setPredictionResult(result);

            const historyEntry = { ...queryParams, predictionResult: result };
            setQueryHistory(prevHistory => [
                historyEntry,
                ...prevHistory
            ].slice(0, 10));

        } catch (error) {
            const errorMessage = error.response?.data?.message || "예측 중 오류가 발생했습니다.";
            setPredictionError(errorMessage);
            setPredictionResult(null);
        } finally {
            setIsPredicting(false);
        }
    };

    // "Get Events" 버튼 클릭 시 호출될 함수
    const handleGetEvents = () => {
        const queryParams = {
            startDate,
            endDate,
            minMagnitude,
            maxMagnitude,
            minDepth,
            maxDepth,
            northCoord,
            westCoord,
            eastCoord,
            southCoord,
            selectedPosition: markerPosition
        };
        handlePrediction(queryParams);
    };

    // Google Maps API 키 로드 및 스크립트 초기화 (기존 로직 유지)
    useEffect(() => {
        const fetchApiKeyAndLoadScript = async () => {
            setStatus(STATUS.LOADING_KEY);
            try {
                const response = await axiosInstance.get('/config/google-key');
                if (response.data && response.data.key) {
                    loadGoogleMapsScript(response.data.key);
                } else {
                    throw new Error('백엔드 응답에 유효한 API 키(key) 필드가 없습니다.');
                }
            } catch (err) {
                const errorMessage = err.response
                    ? `HTTP ${err.response.status} 오류. 로그인 상태와 백엔드 서버를 확인하세요.`
                    : err.message;
                setError(errorMessage);
                setStatus(STATUS.ERROR);
            }
        };

        const loadGoogleMapsScript = (apiKey) => {
            setStatus(STATUS.LOADING_SCRIPT);
            if (window.google) {
                initializeMap();
                return;
            }

            window.initMap = () => {
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
                setError('지도를 초기화하는 데 실패했습니다.');
                setStatus(STATUS.ERROR);
                return;
            }
            if (mapInstanceRef.current) return;

            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: 37.5, lng: 134.0 },
                zoom: 6,
                disableDefaultUI: true,
                zoomControl: true,
                mapId: 'DEMO_MAP_ID'
            });

            mapInstanceRef.current.addListener('click', handleMapClick);
            setStatus(STATUS.READY);
        };

        fetchApiKeyAndLoadScript();

        return () => {
            const script = document.getElementById('google-maps-script');
            if (script) {
                script.remove();
            }
            if (window.initMap) {
                delete window.initMap;
            }
        };
    }, []);


    const StatusOverlay = () => {
        if (status === STATUS.READY) return null;

        let message = '';
        let className = 'status-overlay';
        switch (status) {
            case STATUS.LOADING_KEY:
                message = 'API 키 로드 중...';
                break;
            case STATUS.LOADING_SCRIPT:
                message = '지도 데이터 로드 중...';
                break;
            case STATUS.ERROR:
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
        <div className="tools-page-container">
            <Header />
            <PageInfo 
                historyLinkRef={historyLinkRef} 
                handleShowHistory={(e) => { e.preventDefault(); setHistoryPopoverTarget(e.target); setShowHistoryPopover(!showHistoryPopover); }}
            />
            <div className="main-content-wrapper">
                <MapContainer 
                    status={status}
                    error={error}
                    mapRef={mapRef} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    handleMapClick={handleMapClick} 
                />
                <QueryPanel 
                    startDate={startDate} setStartDate={setStartDate}
                    endDate={endDate} setEndDate={setEndDate}
                    minMagnitude={minMagnitude} maxMagnitude={maxMagnitude}
                    minDepth={minDepth} maxDepth={maxDepth}
                    northCoord={northCoord} setNorthCoord={setNorthCoord}
                    westCoord={westCoord} setWestCoord={setWestCoord}
                    eastCoord={eastCoord} setEastCoord={setEastCoord}
                    southCoord={southCoord} setSouthCoord={setSouthCoord}
                    handleGetEvents={handleGetEvents}
                    isPredicting={isPredicting}
                    status={status}
                    predictionResult={predictionResult}
                    predictionError={predictionError}
                />
            </div>
            <HistoryPopover show={showHistoryPopover} target={historyPopoverTarget} queryHistory={queryHistory} />
        </div>
    );
};

export default ToolsPage;