import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'

function App() {
    // 로딩

    // if login
    return (
        <div className="App">
            <Header />
            <Home />
            <Footer />
        </div>
    )
}

export default App
