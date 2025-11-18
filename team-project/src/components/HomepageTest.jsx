import React from 'react';
import { Link } from 'react-router-dom';

const HomePageTest = () => {
  return (
    <div>
      <h1>Data Service </h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
};

export default HomePageTest;
