import React, { useState, useEffect, useRef, useMemo } from 'react';

// 중요: 더 이상 여기에 API 키를 직접 입력하지 않습니다.
// 대신 백엔드 Spring Boot에서 안전하게 가져오게 됩니다.
const HARDCODED_KEY_CHECK = "YOUR_GOOGLE_MAPS_API_KEY";

/**
 * 지도를 렌더링하는 컴포넌트입니다.
 * Google Maps API가 전역으로 로드된 후에만 렌더링됩니다.
 */
const GoogleMapDisplay = ({ center }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // window.google 객체가 존재하는지 확인하고, 맵을 렌더링할 DOM 요소가 준비되었는지 확인합니다.
        if (window.google && mapRef.current) {
            console.log("Google Maps 객체 확인됨. 지도 초기화 시작.");

            // Map 생성자 호출
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: center,
                zoom: 12,
                // mapId를 사용하는 것이 최신 API 권장 사항입니다. 커스텀 스타일링에 유용합니다.
                mapId: "DEMO_MAP_ID",
                disableDefaultUI: false,
            });

            // 마커 추가 예시
            new window.google.maps.Marker({
                position: center,
                map: mapInstanceRef.current,
                title: "시작 지점 (서울)",
            });
        }
    }, [center]);

    // mapRef는 지도가 초기화될 DOM 요소를 참조합니다.
    return <div
        ref={mapRef}
        className="h-full w-full rounded-xl shadow-inner bg-gray-200"
        aria-label="Google 지도 표시 영역"
    />;
};

/**
 * 메인 애플리케이션 컴포넌트입니다.
 * 1. 백엔드에서 API 키를 가져옵니다.
 * 2. 키를 받으면 Google Maps API 스크립트를 동적으로 로드합니다.
 */
export default function App() {
    const [apiKey, setApiKey] = useState(null); // 백엔드에서 가져온 키
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [error, setError] = useState(null);

    // 지도의 초기 중심 좌표 (예: 서울)
    const defaultCenter = useMemo(() => ({ lat: 37.5665, lng: 126.9780 }), []);

    useEffect(() => {
        // 1. 키를 백엔드에서 가져오는 함수
        const fetchApiKey = async () => {
            try {
                console.log("백엔드에서 API 키 로드 요청: /api/config/google-key");
                // Spring Boot 애플리케이션의 엔드포인트 URL을 사용하세요.
                // 현재는 개발 환경을 위해 상대 경로를 사용합니다.
                const response = await fetch('/api/config/google-key');

                if (!response.ok) {
                    throw new Error(`HTTP 상태 ${response.status}. 백엔드 서버를 확인하세요.`);
                }

                const data = await response.json();

                // 백엔드가 { "key": "AIza..." } 형태로 반환한다고 가정
                if (data.key) {
                    setApiKey(data.key);
                    return data.key;
                } else {
                    throw new Error("백엔드에서 유효한 키(key 필드)를 받지 못했습니다.");
                }
            } catch (e) {
                console.error("API Key Fetch Error:", e);
                setError(`API 키 로드 오류: ${e.message}. 백엔드 연결 및 CORS 설정을 확인하세요.`);
                return null;
            }
        };

        // 2. Google Maps 스크립트를 로드하는 함수
        const loadGoogleMapsScript = (key) => {
            if (window.google) {
                setScriptLoaded(true);
                return;
            }

            if (!key) return;

            const scriptId = 'google-maps-script';
            if (document.getElementById(scriptId)) return;

            const script = document.createElement('script');
            script.id = scriptId;
            // 백엔드에서 가져온 키를 사용
            script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
            script.async = true;

            // 전역 콜백 함수 정의 (스크립트 로드 완료 시 API가 호출하는 함수)
            window.initMap = () => {
                console.log("Google Maps 스크립트 로드 완료.");
                setScriptLoaded(true);
            };

            script.onerror = () => {
                console.error("Google Maps 스크립트 로드 실패.");
                setError("Google Maps 스크립트 로드에 실패했습니다. 키가 유효한지 확인하세요.");
                delete window.initMap;
            };

            document.head.appendChild(script);
            console.log("Google Maps 스크립트 로드 요청 시작...");
        };

        // 3. 실행 로직: 키가 없으면 로드하고, 키가 있으면 스크립트를 로드
        if (!apiKey && !error) {
            fetchApiKey().then(key => {
                if (key) {
                    loadGoogleMapsScript(key);
                }
            });
        } else if (apiKey && !scriptLoaded) {
            loadGoogleMapsScript(apiKey);
        }

        // 4. 클린업 함수
        return () => {
            if (window.initMap) {
                delete window.initMap;
            }
        };
    }, [apiKey, error, scriptLoaded]); // apiKey 상태 변화에 반응하도록 의존성 추가

    const isLoading = !apiKey || !scriptLoaded;

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center font-inter">
            <header className="mb-8 text-center w-full max-w-4xl">
                <h1 className="text-4xl font-extrabold text-indigo-700">
                    Google 지도 컴포넌트 ({isLoading ? '로드 중' : '로드 완료'})
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    API 키를 백엔드에서 가져와 지도를 띄우는 예제입니다.
                </p>
            </header>

            <div className="w-full max-w-4xl h-[60vh] min-h-[400px] bg-white rounded-xl shadow-2xl p-4 transition-all duration-300">
                {error ? (
                    // 1. 에러 표시
                    <div className="flex justify-center items-center h-full text-red-700 bg-red-100 border-2 border-red-300 p-6 rounded-lg text-xl font-bold text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                ) : !apiKey ? (
                    // 2. 키 로드 중 표시 (백엔드 통신 대기)
                    <div className="flex justify-center items-center h-full text-blue-600">
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-xl font-medium">백엔드에서 API 키 로드 중...</p>
                    </div>
                ) : !scriptLoaded ? (
                    // 3. 스크립트 로드 중 표시 (API 키 수신 완료 후)
                    <div className="flex justify-center items-center h-full text-indigo-600">
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-xl font-medium">Google Maps 스크립트 로드 중...</p>
                    </div>
                ) : (
                    // 4. 지도 표시
                    <GoogleMapDisplay center={defaultCenter} />
                )}
            </div>
            <footer className="mt-6 text-sm text-gray-500">
                <p>지도가 성공적으로 로드되면 서울 중심(37.5665, 126.9780)에 위치한 지도가 표시됩니다. (키는 백엔드에서 로드되었습니다)</p>
            </footer>
        </div>
    );
}
