import styles from './Home.module.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Cart } from './Cart/Cart'
import { Community } from './Community/Community'
import { Products } from './Products/Products'
import { Mypage } from './Mypage/Mypage'
import { Main } from './Main/Main'

export const Home = () => {
    return (
        <div className={styles.container}>
            <Routes>
                <Route path="/" element={<Products />} />
                <Route path="/products/*" element={<Products />} />
                <Route path="/community" element={<Community />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/mypage/*" element={<Mypage />} />
            </Routes>
        </div>
    )
}
