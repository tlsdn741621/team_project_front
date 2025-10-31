import React, { createContext, useContext, useState, useEffect } from 'react';
// 설정된 axios 인스턴스를 사용한다고 가정합니다.
// (e.g., util/axiosInstance.js 에 토큰을 헤더에 담아 보내는 로직이 설정되어 있어야 합니다.)
import apiClient from '../util/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // 앱 로드 시 사용자 정보를 가져오는 동안 로딩 상태를 표시하기 위함
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. 앱이 처음 시작될 때 실행되는 로직
  useEffect(() => {
    const fetchUserOnLoad = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          // 저장된 토큰이 있으면, /member/me API로 사용자 정보를 요청합니다.
          const response = await apiClient.get('/member/me');
          // 응답 받은 사용자 정보를 context의 user 상태에 저장합니다.
          setUser(response.data);
        } catch (error) {
          console.error('사용자 정보 로딩 실패:', error);
          // 토큰이 만료되었거나 유효하지 않은 경우, 로그아웃 처리 등을 할 수 있습니다.
        }
      }
      setLoading(false);
    };

    fetchUserOnLoad();
  }, []);

  // 2. 로그인 함수 (기존 로그인 로직에 사용자 정보 요청 추가)
  const login = async (credentials) => {
    // ... 기존의 로그인 처리 로직 (토큰을 받아 localStorage에 저장)

    try {
      // 로그인이 성공하고 토큰을 저장한 직후, /member/me API로 사용자 정보를 요청합니다.
      const response = await apiClient.get('/member/me');
      // 응답 받은 사용자 정보를 context의 user 상태에 저장합니다.
      setUser(response.data);
      navigate('/toolspage'); // 예시: 툴스페이지로 이동
    } catch (error) {
      console.error('로그인 후 사용자 정보 조회 실패:', error);
    }
  };

  // 3. 로그아웃 함수
  const logout = async () => {
    // ... 기존 로그아웃 로직
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // 사용자 정보를 가져오는 동안 로딩 화면을 보여줄 수 있습니다.
  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};