import './App.css'
import { Home } from './pages/Home/Home'
import { Admin } from './pages/Admin/Admin'
import { Side } from './components/Side/Side'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/store'

function App() {
    const [session, setSession] = useState(true)
    const { isAuth, login } = useAuthStore()

    // 로딩

    // if login
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token != null) {
            login(token);
        }
    }, [])

    return (
        <div className="Admin">
            <Router>
                <>
                    <Side />
                    <Admin />
                </>
            </Router>
        </div>
    )
}

export default App
