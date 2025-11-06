import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../util/axiosInstance.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const EarthquakeModal = ({ show, onHide }) => {
    const [earthquakeData, setEarthquakeData] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            const generateAndPredict = async () => {
                setLoading(true);
                setEarthquakeData(null);
                setPredictionResult(null);

                // 1. Generate Random Data
                const magnitude = (Math.random() * 4 + 5).toFixed(1); // 5.0 to 9.0
                const depth = Math.floor(Math.random() * 491 + 10); // 10 to 500 km
                // East Sea Bounding Box (approximate)
                const lat = (Math.random() * 5 + 35).toFixed(4); // 35.0 to 40.0 N
                const lon = (Math.random() * 4 + 128).toFixed(4); // 128.0 to 132.0 E

                const data = { magnitude, depth, lat, lon };
                setEarthquakeData(data);

                try {
                    // 2. Predict Tsunami Probability
                    const response = await axiosInstance.post('/predict/tsunami', {
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lon),
                        magnitude: parseFloat(magnitude),
                        depth: parseFloat(depth),
                    });
                    const result = `${response.data.tsunamiProbability.toFixed(2)}%`;
                    setPredictionResult(result);
                } catch (error) {
                    setPredictionResult('예측 실패');
                } finally {
                    setLoading(false);
                }
            };

            generateAndPredict();
        }
    }, [show]);

    const getProbabilityLevel = (result) => {
        if (!result || result === '예측 실패') return '';
        const percentage = parseFloat(result.replace('%', ''));
        if (percentage <= 30) return '매우 낮음';
        if (percentage <= 50) return '낮음';
        if (percentage <= 80) return '높음';
        return '매우 높음';
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '10px', color: 'red' }} /> 경보!! 지진 발생
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <p>예측 중...</p>}
                {earthquakeData && (
                    <div>
                        <p><strong>발생 정보:</strong></p>
                        <ul>
                            <li>규모 : {earthquakeData.magnitude}</li>
                            <li>깊이 : {earthquakeData.depth} km</li>
                            <li>위도 : {earthquakeData.lat}</li>
                            <li>경도 : {earthquakeData.lon}</li>
                        </ul>
                    </div>
                )}
                {predictionResult && (
                    <div>
                        <hr />
                        <p><strong>쓰나미 발생 확률: {predictionResult} ({getProbabilityLevel(predictionResult)})</strong></p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EarthquakeModal;
