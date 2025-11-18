import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    // --- ⬇️ 이 부분을 추가하세요 ⬇️ ---
    server: {
        proxy: {
            // '/api'로 시작하는 요청은 target 주소로 보냅니다.
            '/api': {
                target: 'http://localhost:8080', // Spring Boot 서버 주소
                changeOrigin: true, // CORS 오류 방지를 위해 필요
            }
        }
    }
    // --- ⬆️ 여기까지 ⬆️ ---
})