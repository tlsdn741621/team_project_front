import './App.css'
import { Route, Routes } from 'react-router-dom';
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import HomePageTest from "./components/HomepageTest.jsx";
import ToolsPage from "./components/ToolsPage.jsx";
import UserNav from "./components/UserNav.jsx";
import MyPage from "./components/MyPage.jsx";
import LoginSuccess from "./components/LoginSuccess.jsx";

function App() {

  return (
    <>
            
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route index element={<HomePageTest />} />
                <Route path="/toolspage" element={<ToolsPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/social-login-success" element={<LoginSuccess />} />
            </Routes>

    </>
  )
}

export default App
