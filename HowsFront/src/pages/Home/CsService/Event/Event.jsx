import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styles from './Event.module.css'
import { Detail } from './Detail/Detail'
import { EventList } from './EventList/EventList' // 공지사항 리스트
export const Event = () => {
    return (
        <div className={styles.noticeCont}>
            <Routes>
                <Route path="/" element={<EventList />} />{' '}
                {/* 공지사항 리스트 */}
                <Route path="/detail/:event_seq" element={<Detail />} />{' '}
                {/* 공지사항 상세 페이지 */}
            </Routes>
        </div>
    )
}
