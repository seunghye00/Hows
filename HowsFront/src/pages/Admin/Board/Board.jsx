import React, { useState } from 'react'
import styles from './Board.module.css'

export const Board = () => {
    const [boardReportModalOpen, setBoardReportModalOpen] = useState(false)

    // 신고 내역 임시 데이터
    const reportData = {
        reporter: '서갈',
        reason: '과도한 욕설',
        date: '2024-09-05',
    }

    // 신고 모달 열기
    const selectreport = () => {
        setBoardReportModalOpen(true)
    }

    // 신고 모달 닫기
    const closeReportModal = () => {
        setBoardReportModalOpen(false)
    }

    return (
        <div className={styles.boardContainer}>
            <div className={styles.headerSection}>
                <h2>Board</h2>
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

            <div className={styles.boardlist}>
                <div className={styles.boardHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>제목</div>
                    <div className={styles.headerItem}>작성자</div>
                    <div className={styles.headerItem}>작성날짜</div>
                    <div className={styles.headerItem}>누적 신고횟수</div>
                    <div className={styles.headerItem}>삭제</div>
                </div>

                <div className={styles.boardRow}>
                    <div className={styles.boardItem}>1</div>
                    <div className={styles.boardItem}>
                        <span className={styles.span}>이것은 게시판!</span>
                    </div>
                    <div className={styles.boardItem}>민바오</div>
                    <div className={styles.boardItem}>2024-08-31</div>

                    <div className={styles.boardItem} onClick={selectreport}>
                        <span className={styles.reportcount}>1</span>
                    </div>
                    <div className={styles.boardItem}>
                        <button className={styles.deletebtn}>삭제</button>
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

            {/* 신고 모달창 */}
            {boardReportModalOpen && (
                <div className={styles.reportModal}>
                    <div className={styles.modalContent}>
                        <h3>게시판 신고내역</h3>
                        <div className={styles.reportTable}>
                            <div className={styles.tableHeader}>
                                <div>신고자</div>
                                <div>신고 사유</div>
                                <div>신고 날짜</div>
                            </div>
                            <div className={styles.tableRow}>
                                <div>{reportData.reporter}</div>
                                <div>{reportData.reason}</div>
                                <div>{reportData.date}</div>
                            </div>
                        </div>
                        <button
                            className={styles.btn}
                            onClick={closeReportModal}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
