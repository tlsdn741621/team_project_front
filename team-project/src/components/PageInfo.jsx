import React, {useState, useEffect, useCallback} from 'react';
import axiosInstance from '../util/axiosInstance';
import '../styles/PageInfo.css'

const PageInfo = ({ historyLinkRef, handleShowHistory, setShowEarthquakeModal }) => {

    const [timer, setTimer] = useState(120);
    const [isLoading, setIsLoading] = useState(false);
    const [earthquakeData, setEarthquakeData] = useState(null);

    const fetchData = useCallback(async () => {
        // setIsLoading(true);
        try {
            const response = await axiosInstance.get('/earthquake/realtime');
            let parsedData = null;

            if (response.data) {
                parsedData = response.data;
            }
            if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
                setEarthquakeData(parsedData[0]);
            } else {
                setEarthquakeData(null);
            }
        } catch (err) {
            console.error("실시간 지진 데이터 요청 오류:", err);
            setEarthquakeData(null);
        } finally {
            // setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 1초마다 타이머 감소 (이전과 동일)
    useEffect(() => {
        if (!isLoading) {
            const intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [isLoading]);

    // 타이머 0이 되면 데이터 요청 (이전과 동일)
    useEffect(() => {
        if (timer <= 0) {
            fetchData();
            setTimer(120);
        }
    }, [timer, fetchData]);

    // 실시간 패널 내용 렌더링 (이전과 동일)
    const renderRealtimeContent = () => {
        if (isLoading) {
            return (
                <div className="loading-state">
                    실시간 지진 데이터 분석중 ⏳
                </div>
            );
        }
        if (earthquakeData) {
            return (
                <div className="data-state">
                    <span className="data-details">
                        위도: {earthquakeData.latitude} |
                        경도: {earthquakeData.longitude} |
                        진도: {earthquakeData.magnitude} |
                        진앙 깊이: {earthquakeData.depth}km
                    </span>
                    <span className="tsunami-probability">
                        쓰나미 발생 확률: {earthquakeData.tsunamiProbability}%
                    </span>
                </div>
            );
        }
        return (
            <div className="no-data-state">
                <span>실시간 지진 발생 없음</span>
            </div>
        );
    };

    // --- ⬇️ 시각적 타이머를 위한 계산 ⬇️ ---

    // 1. 프로그레스 바 퍼센티지 계산 (0% -> 100%)
    //    (120 - 120) / 120 = 0%
    //    (120 - 0) / 120 = 100%
    const progressPercentage = ((120 - timer) / 120) * 100;

    // 2. 남은 시간을 MM:SS 포맷으로 변경 (e.g., "01:35")
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // --- ⬆️ 시각적 타이머를 위한 계산 ⬆️ ---
    return (
        <div className="page-info-area">
            <div className="breadcrumbs">
                <a href="#data-services">DATA SERVICES</a>
            </div>
            <div className="page-title-row">
                <h1 className="page-title" style={{ fontSize: '2em' }}>지도</h1>
                <div className="realtime-info-panel">
                    <div className="realtime-content">
                        {renderRealtimeContent()}
                    </div>
                {!isLoading && (
                    <div className="timer-container">
                        {/* 1. 포맷된 텍스트 타이머 (MM:SS) */}
                        <span className="timer-text">
                                다음 갱신까지: {formattedTimer}
                            </span>

                        {/* 2. 시각적 프로그레스 바 */}
                        <div className="progress-bar-track">
                            <div
                                className="progress-bar-fill"
                                // 인라인 스타일로 계산된 width 적용
                                style={{ width: `${progressPercentage}%` }}
                            >
                            </div>
                        </div>
                    </div>
                )}
                {/* ===================================== */}
                </div>

                <div className="wilber-support" onClick={() => setShowEarthquakeModal(true)}>임시 지진 발생</div>
            </div>
            <div className="page-description">
                <a href="#" ref={historyLinkRef} onClick={handleShowHistory}>기록</a>
            </div>
        </div>
    );
};

export default PageInfo;
