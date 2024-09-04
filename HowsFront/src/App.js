import './App.css'
import { Home } from './pages/Home/Home'
import { Admin } from './pages/Admin/Admin'
import { Side } from './components/Side/Side'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

function App() {
    const [session, setSession] = useState(false)
    // 로딩

    // if login

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
