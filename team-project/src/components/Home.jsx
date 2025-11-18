import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Assuming App.css contains some basic styling for full screen video

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      <video autoPlay loop muted className="fullscreen-video">
        <source src="/image/Tsunami.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay-content">
        <h1>Welcome</h1>
        <button onClick={handleLoginClick} className="login-button">
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
