# 쓰나미 예측 시뮬레이터 (React Frontend)

이 프로젝트는 3-Tier 아키텍처(React-Spring Boot-Flask)의 **클라이언트(UI)**를 담당하는 React 애플리케이션입니다. Spring Boot 백엔드 API 서버와 통신하여 사용자 인증을 처리하고, AI 예측 결과를 지도 위에 시각화하는 기능을 제공합니다.

## 1. 주요 기능

* **사용자 인증**:
    * 일반 이메일/비밀번호를 통한 회원가입 및 로그인.
    * JWT (Access/Refresh Token) 기반의 인증 시스템.
    * 카카오, 구글, 네이버 소셜 로그인 연동.
    * 로그인한 사용자는 MyPage에서 자신의 정보를 관리할 수 있습니다.

* **쓰나미 예측 및 시각화**:
    * ToolsPage에서 쓰나미 예측 시뮬레이션 기능 제공.
    * Prediction 페이지를 통해 예측 결과 확인.
    * MapContainer 컴포넌트를 사용하여 지도 위에 쓰나미 예측 결과를 시각적으로 표시.
    * 지도/위성 뷰 전환 기능.

* **사용자 인터페이스**:
    * Header에 로고, 새로고침, 사용자 네비게이션 메뉴 등을 배치하여 일관된 UI 제공.
    * Home 페이지에 동적인 비디오 배경을 사용하여 시각적 매력도 향상.
    * Bootstrap과 커스텀 CSS를 활용한 반응형 디자인.

## 2. 기술 스택

* **프론트엔드**: React, Vite, JavaScript (ES6+)
* **상태 관리**: React Context API (AuthContext)
* **라우팅**: React Router
* **HTTP 통신**: Axios
* **스타일링**: CSS, Bootstrap, react-bootstrap
* **아이콘**: react-icons, FontAwesome
* **차트/시각화**: recharts
* **실시간 통신**: socket.io-client

## 3. 프로젝트 구조

* `src/`
    * `api/`
        * `client.js`: Axios 인스턴스 설정
    * `components/`: UI 컴포넌트
        * `Login.jsx`: 로그인
        * `Register.jsx`: 회원가입
        * `Home.jsx`: 메인 랜딩 페이지
        * `MapContainer.jsx`: 지도 컨테이너
        * `ToolsPage.jsx`: 시뮬레이션 도구 페이지
    * `contexts/`
        * `AuthContext.jsx`: 사용자 인증 상태 관리
    * `App.jsx`: 메인 애플리케이션 및 라우팅 설정
    * `main.jsx`: 애플리케이션 진입점

## 4. 코드 흐름

1.  **`main.jsx`**: 애플리케이션의 진입점으로, `BrowserRouter`와 `AuthProvider`로 `App` 컴포넌트를 감싸 전체 앱에 라우팅과 인증 컨텍스트를 제공합니다.
2.  **`App.jsx`**: `react-router-dom`을 사용하여 각 URL 경로에 맞는 컴포넌트(e.g., `/login`, `/home`, `/toolspage`)를 렌더링합니다.
3.  **`Login.jsx`**: 사용자는 아이디/비밀번호 또는 소셜 로그인을 통해 백엔드 서버(`team_project_back`)에 인증을 시도합니다.
4.  **`AuthContext.jsx`**: 로그인 성공 시, 서버로부터 받은 JWT를 `localStorage`에 저장하고, 사용자 정보를 상태로 관리합니다. `axiosInstance`를 통해 API 요청 시 자동으로 인증 토큰을 헤더에 추가합니다.
5.  **`ToolsPage.jsx`**: 로그인이 필요한 메인 기능 페이지로, 백엔드 API를 호출하여 AI 예측 결과를 받아오고, `MapContainer`와 같은 컴포넌트를 조합하여 쓰나미 예측 및 시각화 기능을 제공합니다.
6.  **`api/client.js`**: 백엔드 서버와의 통신을 위한 `axios` 인스턴스를 생성하고 관리합니다. `vite.config.js`의 프록시 설정을 통해 CORS 문제를 해결합니다.
