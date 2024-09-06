import React, { useState } from 'react'
import styles from './Blacklist.module.css'

export const Blacklist = () => {
    return (
        <div className={styles.memberContainer}>
            <div className={styles.headerSection}>
                <h2>Black list</h2>
            </div>
            <div className={styles.headerSection}>
                <div className={styles.filter}>
                    전체 ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ
                </div>
                <div className={styles.searchSection}>
                    <select>
                        <option>아이디</option>
                        <option>이름</option>
                    </select>
                    <input type="text" placeholder="검색" />
                    <button>검색</button>
                </div>
            </div>

            <div className={styles.memberlist}>
                <div className={styles.memberHeader}>
                    <div className={styles.headerItem}>이름</div>
                    <div className={styles.headerItem}>아이디</div>
                    <div className={styles.headerItem}>블랙리스트 사유</div>
                    <div className={styles.headerItem}>등록 날짜</div>
                    <div className={styles.headerItem}>해제</div>
                </div>

                <div className={styles.memberRow}>
                    <div className={styles.memberItem}>민바오</div>
                    <div className={styles.memberItem}>user1234</div>
                    <div className={styles.memberItem}>욕설 및 비방</div>
                    <div className={styles.memberItem}>2024-08-31</div>
                    <div className={styles.memberItem}>
                        <button className={styles.deletebtn}>해제</button>
                    </div>
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
