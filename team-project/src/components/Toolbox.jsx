import React from 'react';
import { Link } from 'react-router-dom';

const toolboxStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: '#f0f0f0',
  borderBottom: '1px solid #ccc',
};

const linkStyles = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '1.2rem',
  fontWeight: 'bold',
};

const Toolbox = () => {
  return (
    <div style={toolboxStyles}>
      <Link to="/" style={linkStyles}>Home</Link>
    </div>
  );
};

export default Toolbox;
