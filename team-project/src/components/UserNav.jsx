import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserNav.css'; // Create this CSS file

const UserNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userName = user?.userName || "이름";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="user-nav-container">
      <span className="welcome-message">
        Welcome, {userName} 👋
      </span>
      <nav className="header-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="/mypage" className="nav-link">My Page</a>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link nav-button-link">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserNav;