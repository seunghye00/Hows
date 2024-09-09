import styles from './Home.module.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Cart } from './Cart/Cart'
import { Communities } from './Communities/Communities'
import { Products } from './Products/Products'
import { Mypage } from './Mypage/Mypage'
import { Main } from './Main/Main'
import { Payment } from './Payment/Payment'
import { SignIn } from '../Sign/SignIn/SignIn'
import { SignUp } from '../Sign/SignUp/SignUp'

export const Home = () => {
    return (
        <div className={styles.container}>
            <Routes>
                <Route path="/" element={<Products />} />
                <Route path="/products/*" element={<Products />} />
                <Route path="/communities/*" element={<Communities />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/mypage/*" element={<Mypage />} />
                <Route path="/payment" element={<Payment />} />

                <Route path="/signIn" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
            </Routes>
        </div>
    )
}
