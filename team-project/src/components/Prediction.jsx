import React, { useState } from 'react';
import apiClient from '../util/axiosInstance.jsx';
import UserNav from "./UserNav.jsx";

function Prediction() {
    // 예시 입력 데이터, 실제로는 사용자 입력을 통해 받아야 합니다.
    const [features, setFeatures] = useState('10.5, 20.1, 30.0');
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePredict = async () => {
        setError('');
        setPrediction(null);
        setIsLoading(true);

        try {
            // 입력 문자열을 숫자 배열로 변환
            const featuresArray = features.split(',').map(item => {
                const num = parseFloat(item.trim());
                if (isNaN(num)) {
                    throw new Error("입력값에 숫자가 아닌 값이 포함되어 있습니다.");
                }
                return num;
            });

            const response = await apiClient.post(
                '/regression/predict',
                { features: featuresArray } // 요청 Body
            );

            console.log("예측 성공!", response.data);
            setPrediction(response.data.predictedValue);

        } catch (err) {
            console.error("예측 실패:", err);
            const errorMessage = err.response?.data?.message || err.message || "예측을 가져오는 데 실패했습니다.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <UserNav />
            <div style={{ padding: '20px' }}>
                <h2>AI 예측</h2>
                <p>예측할 특성(feature)들을 쉼표(,)로 구분하여 입력하세요.</p>
                <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="예: 10.5, 20.1, 30.0"
                    rows="4"
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button onClick={handlePredict} disabled={isLoading} style={{ marginTop: '10px' }}>
                    {isLoading ? '예측 중...' : '예측 실행'}
                </button>
                {prediction !== null && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>예측 결과: {prediction}</h3>
                    </div>
                )}
                {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
            </div>
        </div>
    );
}

export default Prediction;
