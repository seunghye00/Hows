import React, { useState } from 'react'
import styles from './Notice.module.css'

export const Notice = () => {
    return (
        <div className={styles.noticeContainer}>
            <div className={styles.headerSection}>
                <h2>Notice</h2>
            </div>
            <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <select>
                        <option>제목</option>
                        <option>작성자</option>
                    </select>
                    <input type="text" placeholder="검색" />
                    <button>검색</button>
                </div>
            </div>

            <div className={styles.noticelist}>
                <div className={styles.noticeHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>조회수</div>
                </div>

                <div className={styles.noticeRow}>
                    <div className={styles.noticeItem}>1</div>
                    <div className={styles.noticeItem}>
                        <span className={styles.span}>이것은 공지사항!</span>
                    </div>
                    <div className={styles.noticeItem}>민바오</div>
                    <div className={styles.noticeItem}>2024-08-31</div>

                    <div className={styles.noticeItem}>
                        <span className={styles.viewcount}>1</span>
                    </div>
                </div>
                <div className={styles.addNtcSection}>
                    <button className={styles.addNtc}>등록</button>
                </div>
            </div>

            <div className={styles.pagination}>
                <i className="bx bx-chevron-left"></i>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <i className="bx bx-chevron-right"></i>
            </div>
        </div>
    )
}
