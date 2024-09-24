import './App.css'
import { Home } from './pages/Home/Home'
import { Admin } from './pages/Admin/Admin'
import { Side } from './components/Side/Side'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore, useMemberStore } from './store/store'
import { jwtDecode } from 'jwt-decode' // import 수정
import { getRoleCode } from './api/member'

function App() {
    const [session, setSession] = useState(true)
    const { isAuth, login } = useAuthStore()
    const { setCurrentUser } = useMemberStore()

    // 로그인 상태 체크
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (token != null) {
            const decoded = jwtDecode(token)
            const nickname = sessionStorage.getItem('nickname')
            const profile = sessionStorage.getItem('member_avatar')

            setCurrentUser({
                nickname: nickname,
                member_avatar: profile,
            })
            login(token)
        }
    }, [login, setCurrentUser])

    useEffect(() => {
        if (isAuth) {
            // 회원 정보 가져오기 (role_code 확인)
            getRoleCode().then(resp => {
                if (resp.data === 'R1') setSession(false)
                else if (resp.data === 'R2') setSession(true)
            })
        } else {
            setSession(true)
        }
    }, [isAuth])

    // Router 내부에서 useLocation 사용
    return (
        <Router>
            <AppContent session={session} />
        </Router>
    )
}

function AppContent({ session }) {
    const location = useLocation()
    // 특정 경로에서 Header와 Footer 숨기기
    const hideHeaderFooter =
        location.pathname.startsWith('/signIn') ||
        location.pathname === '/signUp'

    return (
        <div className={session ? 'App' : 'Admin'}>
            {session ? (
                <>
                    {!hideHeaderFooter && <Header />}
                    <Routes>
                        <Route path="/*" element={<Home />} />
                    </Routes>
                    {!hideHeaderFooter && <Footer />}
                </>
            ) : (
                <>
                    <Routes>
                        <Route
                            path="/admin/*"
                            element={
                                <>
                                    <Side />
                                    <Admin />
                                </>
                            }
                        />
                    </Routes>
                </>
            )}
        </div>
    )
}

export default App
