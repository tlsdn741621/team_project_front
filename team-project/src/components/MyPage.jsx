import React, { useState, useEffect } from 'react';
import './MyPage.css'; // CSS 파일 임포트
import { FaUser, FaEnvelope, FaLock, FaIdBadge } from 'react-icons/fa'; // 아이콘 추가
import { TbDatabaseSearch } from "react-icons/tb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonDrowning } from '@fortawesome/free-solid-svg-icons';
import SAGE_LOGO_URL from '../image/img.png';
import './Header.css';
import { Link } from 'react-router-dom';
import {useAuth} from "../contexts/AuthContext.jsx";
import apiClient from '../util/axiosInstance';

const MyPage = () => {
    // 🔽 useAuth 훅을 사용해 user 정보를 가져옵니다.
    const { user } = useAuth();

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);



    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => { // async 키워드 추가
        e.preventDefault();
        setError('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (passwords.newPassword.length < 4) {
            setError('새 비밀번호는 4자 이상이어야 합니다.');
            return;
        }

        setLoading(true);

        try {
            const response = await apiClient.post('/member/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            alert('비밀번호가 성공적으로 변경되었습니다.');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

        } catch (apiError) {
            console.error('비밀번호 변경 실패:', apiError);

            // 👇 이 부분이 수정되었습니다.
            let errorMessage = '비밀번호 변경 중 오류가 발생했습니다.';
            if (apiError.response && apiError.response.data) {
                // 서버가 보낸 에러 객체에서 'message' 속성만 추출하거나,
                // 데이터 자체가 메시지인 경우를 처리합니다.
                errorMessage = apiError.response.data.message || apiError.response.data;
            }
            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Link to="/toolspage" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 className="project-title" style={{paddingBottom: '20px'}}><FontAwesomeIcon icon={faPersonDrowning} style={{ height: '24px', marginRight: '8px', verticalAlign: 'middle' }} /> Tsunami Prediction</h1>
            </Link>
            <div className="login-box">
                <h1 className="login-title">마이페이지</h1>
                <p className="login-subtitle">{user.userName}님의 정보를 확인하고 수정할 수 있습니다.</p>

                {/* 회원 정보 표시 섹션 */}
                <div className="user-info-section">
                    <div className="info-item">
                        <FaIdBadge className="info-icon" />
                        {/* AuthContext에서 받은 id 또는 email 표시 */}
                        <span>아이디: {user.memberId || '정보 없음'}</span>
                    </div>
                    <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <span>이메일: {user.email || '정보 없음'}</span>
                    </div>
                    <div className="info-item">
                        <FaUser className="info-icon" />
                        {/* AuthContext의 fetchUserProfile을 통해 가져온 userName 표시 */}
                        <span>이름: {user.userName || '정보 없음'}</span>
                    </div>
                </div>


                {/* 비밀번호 변경 폼 */}
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="change-password-title">비밀번호 변경</h2>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="currentPassword"
                            className="input"
                            placeholder="현재 비밀번호"
                            value={passwords.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="newPassword"
                            className="input"
                            placeholder="새 비밀번호 (8자 이상)"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="confirmPassword"
                            className="input"
                            placeholder="새 비밀번호 확인"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <span className="spinner"></span> : '비밀번호 변경'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyPage;