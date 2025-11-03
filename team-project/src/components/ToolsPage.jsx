import React from 'react';
import UserNav from "./UserNav";
import { Link } from 'react-router-dom';

const ToolsPage = () => {
  return (
      <div>
        <UserNav/>
        <h2>메인 화면</h2>
        <Link to="/predict">라우팅 테스트</Link>
      </div>
  );
};

export default ToolsPage;
