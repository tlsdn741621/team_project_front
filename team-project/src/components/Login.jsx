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
        try {
            const response = await axios.post(
                'http://localhost:8080/generateToken',
                form,
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            //추가, 로그인 정보 표기
            //login({ memberId: this.memberId }); // Context에 로그인 정보 저장

            localStorage.setItem('accessToken', response.data.accessToken); // 토큰 저장
            localStorage.setItem('refreshToken', response.data.refreshToken); // 토큰 저장
            // 사용자 정보 가져오기
            const userDetailsResponse = await apiClient.get('/member/me');
            const userName = userDetailsResponse.data.userName; // userName 속성이 있다고 가정

            login({ memberId: form.memberId, userName: userName }); // Context에 로그인 정보 저장
            alert('로그인 성공!');
            navigate('/toolspage'); // 로그인 후 대시보드로 이동
        } catch (error) {
            alert('로그인 실패');
            console.error(error);
        }
    };

    const handleKakaoLogin = () => {
        // Handle Kakao login logic here
        console.log('Logging in with Kakao');
    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
        console.log('Logging in with Google');
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
                    <button
                        type="button"
                        onClick={handleKakaoLogin}
                        style={{
                            backgroundColor: '#FEE500', // Kakao yellow
                            color: '#191919', // Dark text for contrast
                            padding: '12px',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginTop: '-10px', // Reduce space from the login button by counteracting form gap
                            width: '100%', // Make it full width like the login button
                        }}
                    >
                        <RiKakaoTalkFill style={{ marginRight: '8px' }} /> 카카오 로그인
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        style={{
                            backgroundColor: '#FFFFFF', // White background
                            color: '#191919', // Dark text
                            border: '1px solid #000000', // Black border
                            padding: '12px',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginTop: '-10px', // Set negative top margin as requested
                            width: '100%', // Make it full width
                        }}
                    >
                        <FaGoogle style={{ marginRight: '8px' }} /> 구글 로그인
                    </button>
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