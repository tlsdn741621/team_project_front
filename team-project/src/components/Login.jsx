import React, { useState , useEffect } from "react";
import {FaUser, FaEnvelope, FaLock, FaSpinner, FaGoogle } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";

import "./Login.css";
import './Header.css';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext.jsx";
import apiClient from '../util/axiosInstance.jsx'

const Login = () => {
    const API_SERVER_HOST = 'http://localhost:8080';
    const [form, setForm] = useState({ memberId: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect( () => {
        // 1. async 함수를 내부에 정의
        const checkLoginStatus = async () => {
            try {
                await apiClient.get('/member/me'
                );
                console.log("자동 로그인 성공, 홈으로 이동합니다.");
                navigate('/toolspage');

                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                console.log("유효하지 않은 토큰입니다. 로그인 페이지에 머뭅니다.");
            }
        };
        checkLoginStatus();
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!form.memberId) newErrors.memberId = "아이디를 입력해주세요.";


        if (!form.password) newErrors.password = "비밀번호를 입력해주세요.";
        else if (form.password.length < 4)
            newErrors.password = "비밀번호는 4자 이상이어야 합니다.";

        return newErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // 유효성 검사 로직 추가
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true); // 로딩 시작
        try {
            const response = await axios.post(
                `${API_SERVER_HOST}/generateToken`, // 1번에서 추가한 변수 사용
                form,
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            const userDetailsResponse = await apiClient.get('/member/me');
            const userName = userDetailsResponse.data.userName;

            login({ memberId: form.memberId, userName: userName });
            alert('로그인 성공!');
            navigate('/toolspage');
        } catch (error) {
            alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
            console.error(error);
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">
                <h2 className="login-title">Welcome Back!</h2>
                <p className="login-subtitle">로그인하여 계속 진행하세요.</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            name="memberId"
                            placeholder="아이디"
                            value={form.memberId}
                            onChange={handleChange}
                            className={errors.memberId ? "input error" : "input"}
                        />
                    </div>
                    {errors.memberId && <p className="error-text">{errors.memberId}</p>}

                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            value={form.password}
                            onChange={handleChange}
                            className={errors.password ? "input error" : "input"}
                        />
                    </div>
                    {errors.password && <p className="error-text">{errors.password}</p>}

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? <FaSpinner className="spinner" /> : "로그인"}
                    </button>
                    <a href={`${API_SERVER_HOST}/oauth2/authorization/kakao`} style={{ textDecoration: 'none' }}>
                        <button
                            type="button"
                            style={{
                                backgroundColor: '#FEE500',
                                color: '#191919',
                                padding: '12px',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '100%',
                            }}
                        >
                            <RiKakaoTalkFill style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 카카오 로그인
                        </button>
                    </a>
                    <a href={`${API_SERVER_HOST}/oauth2/authorization/google`} style={{ textDecoration: 'none' }}>
                        <button
                            type="button"
                            style={{
                                backgroundColor: '#FFFFFF',
                                color: '#191919',
                                border: '1px solid #000000',
                                padding: '12px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '100%',
                            }}
                        >
                            <FaGoogle style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 구글 로그인
                        </button>
                    </a>
                    <a href={`${API_SERVER_HOST}/oauth2/authorization/naver`} style={{ textDecoration: 'none' }}>
                        <button
                            type="button"
                            style={{
                                backgroundColor: '#03C75A',
                                color: 'white',
                                padding: '12px',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '100%',
                            }}
                        >
                            <span style={{ marginRight: '8px', verticalAlign: 'middle', fontWeight:'bold' }}>N</span> 네이버 로그인
                        </button>
                    </a>
                </form>

                <p className="signup-text">
                    계정이 없으신가요?{" "}
                    <a href="/register" className="signup-link">
                        회원가입
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;