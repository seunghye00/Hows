import styles from './Admin.module.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Title from '../../components/Title/Title'
import { Main } from './Main/Main'
import { Banner } from './Banner/Banner'
import { Member } from './Member/Member'
import { Blacklist } from './Member/Blacklist'
import { Community } from './Community/Community'
import { Comment } from './Comment/Comment'
import { Reply } from './Reply/Reply'
import { Review } from './Review/Review'
import { Notice } from './Notice/Notice'
import Faq from './Notice/FAQ/Faq'
import { Product } from './Product/Product'
import { WriteNotice } from './Notice/WriteNotice'
import { ModifyNotice } from './Notice/ModifyNotice'

export const Admin = () => {
    return (
        <div className={styles.container}>
            <Routes>
                <Route path="/admin" element={<Main />} />
                <Route
                    path="/admin/banner"
                    element={
                        <>
                            <Title title={'배너 관리'} />
                            <Banner />
                        </>
                    }
                />
                <Route path="/admin/product/*" element={<Product />} />
                <Route path="/admin/notice/*" element={<WriteNotice />} />
                <Route path="/admin/notice/*" element={<ModifyNotice />} />
                <Route
                    path="/member"
                    element={
                        <>
                            <Title title={'회원 관리'} />
                            <Member />
                        </>
                    }
                />
                <Route
                    path="/blacklist"
                    element={
                        <>
                            <Title title={'블랙리스트 관리'} />
                            <Blacklist />
                        </>
                    }
                />
                <Route
                    path="/community"
                    element={
                        <>
                            <Title title={'게시판 관리'} />
                            <Community />
                        </>
                    }
                />
                <Route
                    path="/comment"
                    element={
                        <>
                            <Title title={'댓글 관리'} />
                            <Comment />
                        </>
                    }
                />
                <Route
                    path="/reply"
                    element={
                        <>
                            <Title title={'대댓글 관리'} />
                            <Reply />
                        </>
                    }
                />
                <Route
                    path="/review"
                    element={
                        <>
                            <Title title={'리뷰 관리'} />
                            <Review />
                        </>
                    }
                />
                <Route
                    path="/notice"
                    element={
                        <>
                            <Title title={'공지사항 관리'} />
                            <Notice />
                        </>
                    }
                />
                <Route
                    path="/admin/notice/faq"
                    element={
                        <>
                            <Title title={'FAQ 관리'} />
                            <Faq />
                        </>
                    }
                />
            </Routes>
        </div>
    )
}
