import './App.css'
import { Home } from './pages/Home/Home'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
    // 로딩

    // 로딩

    // if login

    return (
        <div className="App">
            <Router>
                <Header />
                <Home />
                <Footer />
            </Router>
        </div>
    )
}

export default App
