import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext 사용
import apiClient from '../util/axiosInstance'; // 설정된 axios 인스턴스 사용

const SocialLoginSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth(); // AuthContext의 login 함수 사용

    useEffect(() => {
        const handleLoginSuccess = async () => {
            // 1. URL에서 토큰 추출
            const accessToken = searchParams.get('accessToken');
            const refreshToken = searchParams.get('refreshToken');

            if (!accessToken) {
                console.error("액세스 토큰이 URL에 없습니다.");
                navigate('/login'); // 토큰 없으면 로그인 페이지로
                return;
            }

            console.log("소셜 로그인 성공! 토큰을 저장합니다.");
            // 2. 토큰을 로컬 스토리지에 저장
            localStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }

            try {
                // 3. 저장된 토큰으로 사용자 정보 요청 (axiosInstance가 자동으로 헤더에 토큰을 추가해 줌)
                console.log("사용자 정보를 요청합니다...");
                const response = await apiClient.get('/member/me');
                const userData = response.data;
                console.log("받은 사용자 정보:", userData);

                // 4. AuthContext에 사용자 정보 저장하여 로그인 상태로 만듦
                login(userData);

                // 5. 모든 처리가 끝나면 메인 페이지로 이동
                navigate('/toolspage');

            } catch (error) {
                console.error("사용자 정보 로드 실패:", error);
                // 실패 시 로컬 스토리지 비우고 로그인 페이지로
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
        };

        handleLoginSuccess();
    }, [searchParams, navigate, login]);

    return (
        <div>
            <h2>소셜 로그인 처리 중...</h2>
            <p>잠시만 기다려주세요.</p>
        </div>
    );
};

export default SocialLoginSuccess;