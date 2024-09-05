import styles from './Admin.module.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Title from '../../components/Title/Title'
import { Main } from './Main/Main'
import { Banner } from './Banner/Banner'
import { Member } from './Member/Member'
import { Blacklist } from './Member/Blacklist'
import { Board } from './Board/Board'
import { Comment } from './Comment/Comment'
import { Review } from './Review/Review'
import { Notice } from './Notice/Notice'
import { Faq } from './Notice/Faq'
import { Product } from './Product/Product'

export const Admin = () => {
    return (
        <div className={styles.container}>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route
                    path="/banner"
                    element={
                        <>
                            <Title title={'배너 관리'} />
                            <Banner />
                        </>
                    }
                />
                <Route path="/product/*" element={<Product />} />
                <Route path="/member" element={<Member />} />
                <Route path="/blacklist" element={<Blacklist />} />
                <Route path="/board" element={<Board />} />
                <Route path="/comment" element={<Comment />} />
                <Route path="/review" element={<Review />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/faq" element={<Faq />} />
            </Routes>
        </div>
    )
}
