import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { NoticeList } from './NoticeList/NoticeList' // 공지사항 리스트
import { Detail } from './Detail/Detail' // 공지사항 디테일
import styles from './Notice.module.css'

export const Notice = () => {
    return (
        <div className={styles.noticeCont}>
            <Routes>
                <Route path="/" element={<NoticeList />} />{' '}
                {/* 공지사항 리스트 */}
                <Route path="/detail/:notice_seq" element={<Detail />} />{' '}
                {/* 공지사항 상세 페이지 */}
            </Routes>
        </div>
    )
}
