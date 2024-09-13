import './App.css'
import { Home } from './pages/Home/Home'
import { Admin } from './pages/Admin/Admin'
import { Side } from './components/Side/Side'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore, useMemberStore } from './store/store';
import { jwtDecode } from 'jwt-decode'


function App() {
    const [session, setSession] = useState(true);
    const { isAuth, login } = useAuthStore();
    const { setCurrentUser } = useMemberStore();

    // 로딩

    // if login
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token != null) {
            const decoded = jwtDecode(token);
            sessionStorage.getItem("member_id");
            const nickname = sessionStorage.getItem("nickname");
            const profile = sessionStorage.getItem("member_avatar");

            setCurrentUser({
                "nickname": nickname,
                "member_avatar": profile
            });

            login(token);
        }
    }, [])

    return (
        <div className={session ? 'App' : 'Admin'}>
            <Router>
                {session ? (
                    <>
                        <Header />
                        <Home />
                        <Footer />
                    </>
                ) : (
                    <>
                        <Side />
                        <Admin />
                    </>
                )}
            </Router>
        </div>
    )
}

export default App
