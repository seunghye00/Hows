import styles from './Admin.module.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Main } from './Main/Main'
import { Banner } from './Banner/Banner'

export const Admin = () => {
    return (
        <div className={styles.container}>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/banner" element={<Banner />}></Route>
            </Routes>
        </div>
    )
}
